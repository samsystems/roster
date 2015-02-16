package controllers

import (
	"github.com/gorilla/mux"
	"net/http"

	"encoding/json"
	"io/ioutil"

	"appengine"

	"github.com/sam/roster/handler"
	"github.com/sam/roster/models"
	"github.com/sam/roster/validation"
)

// Operations about Users
type InvoiceController struct {
}

func (c *InvoiceController) RegisterHandlers(r *mux.Router) {
	r.Handle("/invoice/{uid}", handler.New(c.Get)).Methods("GET")
	r.Handle("/invoice", handler.New(c.GetAll)).Methods("GET")
	r.Handle("/invoice", handler.New(c.Post)).Methods("POST")
	r.Handle("/invoice", handler.New(c.Put)).Methods("PUT")
	r.Handle("/invoice/{uid}", handler.New(c.Delete)).Methods("DELETE")
	r.Handle("/invoice/count", handler.New(c.Count)).Methods("GET")
}

// @Title Get
// @Description get all Invoices
// @Success 200 {object} models.Invoice
// @router / [get]
func (controller *InvoiceController) GetAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	var invoices *[]models.Invoice

	status := v["status"]
	page, sort, keyword := ParseParamsOfGetRequest(v)

	if keyword != "" {
		invoices, _ = models.GetInvoiceByKeyword(status, keyword, page, sort, false, -1)

	} else {
		invoices, _ = models.GetAllInvoices(status, page, sort, false, -1)
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
	status := v["status"]
	keyword := ""
	if keywordP := v["keyword"]; keywordP != "" {
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
	json.Unmarshal(data, &invoice)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	invoice.Creator = user
	invoice.Updater = user

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
		models.UpdateInvoice(&invoice)
	}

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

	models.DeleteInvoice(invoice)

	return nil, nil
}

// @Title Create Invoice
// @Description Create Invoice
// @Param	body		body 	models.Invoice	true		"body for invoice content"
// @Success 200 {int} models.Invoice.Id
// @Failure 403 body is empty
// @router / [post]
func (g *InvoiceController) Post(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {

	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var invoice models.Invoice
	json.Unmarshal(data, &invoice)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	invoice.Creator = user
	invoice.Updater = user
	invoice.OrderNumber = models.GetMaxOrderNumber()

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
	}

	return invoice, nil
}
