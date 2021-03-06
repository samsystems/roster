package controllers

import (
	"github.com/gorilla/mux"
	"net/http"

	"encoding/json"
	"io/ioutil"

	"appengine"

	"handler"
	"models"
	"validation"
	"math"

)

type PurchaseOrderController struct {
}

func (c *PurchaseOrderController) RegisterHandlers(r *mux.Router) {
	r.Handle("/purchase/count", handler.New(c.Count)).Methods("GET")
	r.Handle("/purchase/{uid:[a-zA-Z0-9\\-]+}", handler.New(c.Get)).Methods("GET")
	r.Handle("/purchase", handler.New(c.GetAll)).Methods("GET")
	r.Handle("/purchase", handler.New(c.Post)).Methods("POST")
	r.Handle("/purchase/{uid:[a-zA-Z0-9\\-]+}", handler.New(c.Put)).Methods("PUT")
	r.Handle("/purchase/{uid:[a-zA-Z0-9\\-]+}", handler.New(c.Delete)).Methods("DELETE")
	r.Handle("/purchase/count", handler.New(c.Count)).Methods("GET")
	r.Handle("/purchase/resume/{status}", handler.New(c.GetResumePurchases)).Methods("GET")
	r.Handle("/purchase/{uid:[a-zA-Z0-9\\-]+}/products", handler.New(c.GetAllProducts)).Methods("GET")
}

// @Title Get
// @Description get purchase order by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.PurchaseOrder
// @Failure 403 :uid is empty
// @router /:uid [get]
func (c *PurchaseOrderController) Get(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	purchaseOrder, err := models.GetPurchaseOrder(uid)
	if err != nil {
		return nil, &handler.Error{err, "Error querying database", http.StatusInternalServerError}
	}

	return purchaseOrder, nil
}

// @Title Get
// @Description get all Companies
// @Param	page	    int
// @Param	sort		string
// @Param	keyword		string
// @Param	status		string
// @Success 200 {array} models.PurchaseOrder
// @router / [get]
func (c *PurchaseOrderController) GetAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	status := models.PURCHASE_ALL
	if statusP := request.URL.Query().Get("status"); statusP != "" {
		status = statusP
	}

	var purchases *[]models.PurchaseOrder
	page, sort, keyword := ParseParamsOfGetRequest(request.URL.Query())
	if keyword != "" {
		purchases, _ = models.GetPurchaseOrderByKeyword(keyword, page, sort, false, -1)
	} else {
		purchases, _ = models.GetAllPurchaseOrder(status, page, sort, false, -1)
	}

	return purchases, nil
}

// @Title Get Count Companies
// @Description get count Companies
// @Param	keyword		string
// @Success 200 {array} models.PurchaseOrder
// @router /count [get]
func (c *PurchaseOrderController) Count(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	total := make(map[string]interface{})

	status := models.PURCHASE_ALL
	if statusP := request.URL.Query().Get("status"); statusP != "" {
		status = statusP
	}

	keyword := ""
	if keywordP := request.URL.Query().Get("keyword"); keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetPurchaseOrderByKeyword(keyword, 1, "notSorting", true, -1)
	} else {
		_, total["total"] = models.GetAllPurchaseOrder(status, 1, "notSorting", true, -1)
	}

	return total, nil
}

// @Title Get Resume from Purchases
// @Description get Resume from Purchases
// @Param	status	int
// @Success int
// @router /resume/:status [get]
func (c *PurchaseOrderController) GetResumePurchases(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	status := v["status"]
	total := make(map[string]interface{})
	total["amount"], total["cant"] = models.GetPurchaseResume(status)

	return total, nil
}

// @Title createPurchaseOrder
// @Description create purchases
// @Param	body		body 	models.PurchaseOrder	true		"body for user content"
// @Success 200 {int} models.User.Id
// @Failure 403 body is empty
// @router / [post]
func (c *PurchaseOrderController) Post(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {


	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var purchaseOrder models.PurchaseOrder
	err=json.Unmarshal(data, &purchaseOrder)
	if err != nil {
		panic(err)
	}
	user, _ := models.GetCurrentUser(request)
	purchaseOrder.Creator = user
	purchaseOrder.Updater = user
	
	purchaseOrder.Company = user.Company
	
	purchaseOrderItems := purchaseOrder.PurchaseProducts
	purchaseOrder.PurchaseProducts = nil

	var subTotal float32 = 0
	for i := 0; i < len(purchaseOrderItems); i++ {
		subTotal += float32(purchaseOrderItems[i].Price) * float32(purchaseOrderItems[i].QuantitySolicited)
		product, _ := models.GetProduct(purchaseOrderItems[i].Product.Id)
		purchaseOrderItems[i].Product = product
	}
	purchaseOrder.SubTotal = PurchaseRoundPlus((subTotal), 2)
	purchaseOrder.TotalTax = PurchaseRoundPlus((subTotal*float32(purchaseOrder.Tax))/100, 2)
	purchaseOrder.Amount = purchaseOrder.TotalTax + purchaseOrder.SubTotal
	purchaseOrder.OrderNumber = models.GetPurchaseMaxOrderNumber()
	purchaseOrder.Status = models.PURCHASE_DRAFT

	valid := validation.Validation{}
	b, err := valid.Valid(&purchaseOrder)

	if err != nil {
		return nil, &handler.Error{err, "Validation errors", http.StatusNoContent}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusNoContent}
		}
		return nil, &handler.Error{nil, "Entity not found", http.StatusNoContent}
	} else {
		models.AddPurchaseOrder(&purchaseOrder)
		for i := 0; i < len(purchaseOrderItems); i++ {
			var purchaseOrderItem = purchaseOrderItems[i]
			purchaseOrderItem.Creator = user
			purchaseOrderItem.Updater = user
			purchaseOrderItem.PurchaseOrder = &purchaseOrder
			models.AddPurchaseOrderItem(purchaseOrderItem)
		}
	}

	return purchaseOrder, nil
}

// @Title updatePurchaseOrder
// @Description update purchases
// @Param	body		body 	models.PurchaseOrder	true		"body for user content"
// @Success 200 {int} models.User.Id
// @Failure 403 body is empty
// @router /:uid [put]
func (c *PurchaseOrderController) Put(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {

	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}
	var purchaseOrder models.PurchaseOrder
	json.Unmarshal(data, &purchaseOrder)
	user, _ := models.GetCurrentUser(request)
	purchaseOrderItems := purchaseOrder.PurchaseProducts
	if purchaseOrderItems != nil{
		purchaseOrder.Updater = user
		
		purchaseOrder.PurchaseProducts = nil
	
		var subTotal float32 = 0
		for i := 0; i < len(purchaseOrderItems); i++ {
			subTotal += float32(purchaseOrderItems[i].Price) * float32(purchaseOrderItems[i].QuantitySolicited)
			product, _ := models.GetProduct(purchaseOrderItems[i].Product.Id)
			purchaseOrderItems[i].Product = product
		}
		purchaseOrder.SubTotal = PurchaseRoundPlus((subTotal), 2)
		purchaseOrder.TotalTax = PurchaseRoundPlus((subTotal*float32(purchaseOrder.Tax))/100, 2)
		purchaseOrder.Amount = purchaseOrder.TotalTax + purchaseOrder.SubTotal
	//	purchaseOrder.Status = models.PURCHASE_DRAFT
	} else{
		uid := v["uid"]
		status :=purchaseOrder.Status 
		purchaseOrder, _ := models.GetPurchaseOrder(uid)
		purchaseOrder.Updater = user
		purchaseOrder.Status = status
	}

	valid := validation.Validation{}
	b, err := valid.Valid(&purchaseOrder)
	if err != nil {
		return nil, &handler.Error{err, "Validation errors", http.StatusNoContent}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusNoContent}
		}
		return nil, &handler.Error{nil, "Entity not found", http.StatusNoContent}
	} else {
		models.UpdatePurchaseOrder(&purchaseOrder)
		if purchaseOrderItems != nil{
			idsPurchaseOrderItem := make([]string, len(purchaseOrderItems))
			for i := 0; i < len(purchaseOrderItems); i++ {
				var purchaseOrderItem = purchaseOrderItems[i]
				purchaseOrderItem.Updater = user
				purchaseOrderItem.PurchaseOrder = &purchaseOrder
				if purchaseOrderItem.Id !=""{
					idsPurchaseOrderItem[i] = purchaseOrderItem.Id
					models.UpdatePurchaseOrderItem(purchaseOrderItem)
				}else{
					purchaseOrderItem.Creator = user
					idsPurchaseOrderItem[i] =models.AddPurchaseOrderItem(purchaseOrderItem)
				}
			}
			purchaseOrderItemsDelete := models.GetAllPurchaseOrderItemsToDelete(purchaseOrder.Id, idsPurchaseOrderItem)
				for i := 0; i < len(purchaseOrderItemsDelete); i++ {
					models.DeletePurchaseOrderItem(&purchaseOrderItemsDelete[i])
			}
		}
	}

	return purchaseOrder, nil

}

// @Title delete
// @Description delete the PurchaseOrder
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (controller *PurchaseOrderController) Delete(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	purchaseOrder, err := models.GetPurchaseOrder(uid)
	if err != nil {
		return nil, &handler.Error{err, "Entity not found", http.StatusNoContent}
	}

	models.DeletePurchaseOrder(purchaseOrder)

	return nil, nil
}
// @Title Get
// @Description get all Invoices
// @Success 200 {object} models.Invoice
// @router /:id/products [get]
func (controller *PurchaseOrderController) GetAllProducts(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uidPurchase := v["uid"]
	var purchaseOrderItems []models.PurchaseOrderItem = models.GetAllPurchaseOrderItems(uidPurchase)
	return purchaseOrderItems, nil
}

func PurchaseRoundPlus(f float32, places int) float32 {
	shift := math.Pow(10, float64(places))
	return float32(PurchaseRound(float64(f)*shift) / shift)
}
func PurchaseRound(f float64) float64 {
	return float64(math.Floor(f + .5))
}

