package controllers

import (
	"github.com/gorilla/mux"
	"net/http"

	"encoding/json"
	"io/ioutil"

	"appengine"

	"github.com/samsystems/roster/handler"
	"github.com/samsystems/roster/models"
	"github.com/samsystems/roster/validation"

	"log"

	"math"
	"time"
)

// Operations about Users
type InvoiceController struct {
}

func (controller *InvoiceController) RegisterHandlers(r *mux.Router) {
	r.Handle("/invoice/count", handler.New(controller.Count)).Methods("GET")
	r.Handle("/invoice/max-ordernumber", handler.New(controller.GetMaxOrderNumber)).Methods("GET")
	r.Handle("/invoice/resume/{status:[a-zA-Z\\-]+}", handler.New(controller.GetInvoiceResume)).Methods("GET")
	r.Handle("/invoice/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Get)).Methods("GET")
	r.Handle("/invoice", handler.New(controller.GetAll)).Methods("GET")
	r.Handle("/invoice", handler.New(controller.Post)).Methods("POST")
	r.Handle("/invoice/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Put)).Methods("PUT")
	r.Handle("/invoice/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Delete)).Methods("DELETE")
	r.Handle("/invoice/{uid:[a-zA-Z0-9\\-]+}/products", handler.New(controller.GetAllProducts)).Methods("GET")
}

// @Title Get
// @Description get all Invoices
// @Success 200 {object} models.Invoice
// @router / [get]
func (controller *InvoiceController) GetAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	var invoices []models.Invoice
	status := request.URL.Query().Get("status")

	page, sort, keyword := ParseParamsOfGetRequest(request.URL.Query())

	if keyword != "" {
		invoices, _ = models.GetInvoiceByKeyword(status, keyword, page, sort, false, -1)

	} else {
		invoices, _ = models.GetAllInvoices(status, page, sort, false, -1)
	}
	if(len(invoices)== 0){
 		return make([]models.Invoice,0), nil
 	}
	return invoices, nil
}

// @Title Get
// @Description get invoice by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Invoice
// @Failure 403 :uid is empty
// @router /:uid [get]
func (controller *InvoiceController) Get(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	invoice, err := models.GetInvoice(uid)
	if err != nil {
		return nil, &handler.Error{err, "Error querying database", http.StatusInternalServerError}
	}

	return invoice, nil
}

// @Title Get Count Invoices
// @Description get count Invoices
// @Param	keyword		string
// @Success 200 {array} models.Invoice
// @router /count [get]
func (controller *InvoiceController) Count(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	total := make(map[string]interface{})
	status := request.URL.Query().Get("status")
	keyword := ""
	if keywordP := request.URL.Query().Get("keyword"); keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetInvoiceByKeyword(status, keyword, 1, "notSorting", true, -1)
	} else {
		_, total["total"] = models.GetAllInvoices(status, 1, "notSorting", true, -1)
	}

	return total, nil
}

// @Title Get Max Order Number from Invoices
// @Description get Max Order Number from Invoices
// @Param	status		string
// @Success 200 int
// @router /max-ordernumber [get]
func (controller *InvoiceController) GetMaxOrderNumber(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	total := make(map[string]interface{})
	total["max"] = models.GetMaxOrderNumber()

	return total, nil
}

// @Title Get Resume from Invoices
// @Description get Resume from Invoices
// @Param	status		string
// @Success int
// @router /resume/:status [get]
func (controller *InvoiceController) GetInvoiceResume(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	status := v["status"]
	total := make(map[string]interface{})
	total["amount"], total["cant"] = models.GetInvoiceResume(status)

	return total, nil
}

// @Title updateInvoice
// @Description update invoices
// @Param	body		body 	models.Invoice	true		"body for user content"
// @Success 200 {int} models.Invoice.Id
// @Failure 403 body is empty
// @router /:uid [put]
func (controller *InvoiceController) Put(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {

	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var invoice models.Invoice
	err1 := json.Unmarshal(data, &invoice)
	if err1 != nil {
		log.Println("error:", err1)
	}
	invoiceSave,_ := models.GetInvoice(invoice.Id)
	if(invoiceSave.Status != "draft"){
		invoiceSave.Status=invoice.Status
		models.UpdateInvoice(invoiceSave)	
		return invoiceSave, nil
	}
	
	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	invoice.Creator = user
	invoice.Updater = user
	invoiceProducts := invoice.InvoiceProducts
	invoice.InvoiceProducts = nil

	// TODO: temporal
	invoice.Date = time.Now()
	invoice.DeliveryDate = time.Now()

	var subTotal float64 = 0
	
	for i := 0; i < len(invoiceProducts); i++ {
		var restStock int
		if(invoiceProducts[i].Id != ""){
			invoiceProducTmp,_ := models.GetInvoiceProduct(invoiceProducts[i].Id)
			invoiceProducTmp.Quantity=invoiceProducts[i].Quantity
			invoiceProducTmp.QuantitySave=invoiceProducts[i].QuantitySave
			invoiceProducts[i]=invoiceProducTmp;
			restStock = invoiceProducts[i].Quantity - invoiceProducts[i].QuantitySave
		}else{
			invoiceProducts[i].Creator= user
			restStock = invoiceProducts[i].Quantity
		}
		
		subTotal+= float64(invoiceProducts[i].Price) * float64(invoiceProducts[i].Quantity)
		invoiceProducts[i].Product, _ = models.GetProduct(invoiceProducts[i].Product.Id)
		if((invoiceProducts[i].Product.Stock - restStock) < 0){
			return nil, &handler.Error{err, "Not in stock", http.StatusBadRequest}
		}
		invoiceProducts[i].Updater= user
	    
	    invoiceProducts[i].Product.Stock = invoiceProducts[i].Product.Stock - restStock
		//invoiceProducts[i].Product= product
	}
	invoice.SubTotal = subTotal
	invoice.TotalTax = RoundPlus((subTotal*float64(invoice.Tax))/100, 2)
	invoice.Amount = invoice.TotalTax + subTotal

	valid := validation.Validation{}
	b, err := valid.Valid(&invoice)
	if err != nil {
		return nil, &handler.Error{err, "Validation Errors", http.StatusBadRequest}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusBadRequest}
		}
		return nil, &handler.Error{err, "Entity Not Found", http.StatusNoContent}
	} else {
		idsInvoiceProduct := make([]string, len(invoiceProducts))
		models.UpdateInvoice(&invoice)	
	    for i := 0; i < len(invoiceProducts); i++ {
			var invoiceProduct = invoiceProducts[i]     		
     		
			invoiceProduct.Invoice= &invoice
			if(invoiceProduct.Id != ""){
			 	models.UpdateInvoiceProduct(invoiceProduct)
			}else{
			 	models.AddInvoiceProduct(invoiceProduct)
		 	}
			models.UpdateProduct(invoiceProduct.Product)
			idsInvoiceProduct[i] = invoiceProduct.Id
		}
	    invoiceDelete := models.GetAllInvoiceProductsByIds(invoice.Id,idsInvoiceProduct)
	    for i := 0; i < len(invoiceDelete); i++ {
	    	product, _ := models.GetProduct(invoiceDelete[i].Product.Id)
	    	product.Stock = product.Stock + invoiceDelete[i].Quantity
	    	models.UpdateProduct(product)
	    	models.DeleteInvoiceProduct(&invoiceDelete[i])
	    }
	    
	}
	//delete productInvoice
	

	return invoice, nil
}

// @Title delete
// @Description delete the Invoice
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (c *InvoiceController) Delete(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	invoice, err := models.GetInvoice(uid)
	if err != nil {
		return nil, &handler.Error{err, "Entity Not Found", http.StatusNoContent}
	}
	
	if(invoice.Status != "draft"){
		return nil, &handler.Error{err, "You can only delete invoice with draft status", http.StatusNoContent}
	}

	models.DeleteInvoice(invoice)

	return nil, nil
}

// @Title Create Invoice
// @Description Create Invoice
// @Param	body		body 	models.Invoice	true		"body for invoice content"
// @Success 200 {int} models.Invoice.Id
// @Failure 403 body is empty
// @router / [post]
func (controller *InvoiceController) Post(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {

	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var invoice models.Invoice
	err1 := json.Unmarshal(data, &invoice)
	if err1 != nil {
		log.Println("error:", err1)
	}

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	company, _ := models.GetCompany(user.Company.Id)
	invoice.Creator = user
	invoice.Updater = user
	invoice.Tax = company.Tax
	invoice.OrderNumber = models.GetMaxOrderNumber()
	invoiceProducts := invoice.InvoiceProducts
	invoice.InvoiceProducts = nil

	// TODO: temporal
	invoice.Date = time.Now()
	invoice.DeliveryDate = time.Now()

	var subTotal float64 = 0
	for i := 0; i < len(invoiceProducts); i++ {
		subTotal += float64(invoiceProducts[i].Price) * float64(invoiceProducts[i].Quantity)
		product, _ := models.GetProduct(invoiceProducts[i].Product.Id)
		if product.Stock < invoiceProducts[i].Quantity {
			return nil, &handler.Error{err, "Not in stock", http.StatusBadRequest}
		}
		product.Stock = product.Stock - invoiceProducts[i].Quantity
		invoiceProducts[i].Product = product
	}
	invoice.SubTotal = subTotal
	invoice.TotalTax = RoundPlus((subTotal*float64(invoice.Tax))/100, 2)
	invoice.Amount = invoice.TotalTax + subTotal

	valid := validation.Validation{}
	b, err := valid.Valid(&invoice)
	if err != nil {
		return nil, &handler.Error{err, "Validation Errors", http.StatusBadRequest}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusNoContent}
		}
		return nil, &handler.Error{err, "Entity Not Found", http.StatusNoContent}
	} else {
		models.AddInvoice(&invoice)

		for i := 0; i < len(invoiceProducts); i++ {
			var invoiceProduct = invoiceProducts[i]
			invoiceProduct.Creator = user
			invoiceProduct.Updater = user
			invoiceProduct.Invoice = &invoice
			models.AddInvoiceProduct(invoiceProduct)
			models.UpdateProduct(invoiceProduct.Product)
		}
		//models.CreateFromInvoice(invoice)

	}

	return invoice, nil
}

// @Title Get
// @Description get all Invoices
// @Success 200 {object} models.Invoice
// @router /:id/products [get]
func (controller *InvoiceController) GetAllProducts(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uidInvoice := v["uid"]
	var invoices []models.InvoiceProduct = models.GetAllInvoiceProducts(uidInvoice)
	return invoices, nil
}

func Round(f float64) float64 {
	return math.Floor(f + .5)
}

func RoundPlus(f float64, places int) float64 {
	shift := math.Pow(10, float64(places))
	return Round(f*shift) / shift
}