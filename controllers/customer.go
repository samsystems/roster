package controllers

import (
	"github.com/gorilla/mux"
	"net/http"

	"encoding/json"
	"io/ioutil"

	"appengine"

	"handler"
	"log"
	"models"
	"validation"
)

// Operations about Customers
type CustomerController struct {
}

func (controller *CustomerController) RegisterHandlers(r *mux.Router) {
	r.Handle("/customer/count", handler.New(controller.GetCountAll)).Methods("GET")
	r.Handle("/customer/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Get)).Methods("GET")
	r.Handle("/customer", handler.New(controller.GetAll)).Methods("GET")
	r.Handle("/customer", handler.New(controller.Post)).Methods("POST")
	r.Handle("/customer/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Put)).Methods("PUT")
	r.Handle("/customer/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Delete)).Methods("DELETE")
	r.Handle("/customer/{uid:[a-zA-Z0-9\\-]+}/contacts", handler.New(controller.GetAllContacts)).Methods("GET")
}

// @Title Get
// @Description get customer by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Customer
// @Failure 403 :uid is empty
// @router /:uid [get]
func (controller *CustomerController) Get(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	customer, err := models.GetCustomer(uid)
	if err != nil {
		return nil, &handler.Error{err, "Error querying database", http.StatusInternalServerError}
	}

	return customer, nil

}

// @Title Get
// @Description get all Customers
// @Param	page	    int
// @Param	sort		string
// @Param	keyword		string
// @Success 200 {array} models.Customer
// @router / [get]
func (controller *CustomerController) GetAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	var customers []models.Customer
	page, sort, keyword := ParseParamsOfGetRequest(request.URL.Query())

	if keyword != "" {
		customers, _ = models.GetCustomerByKeyword(keyword, page, sort, false, -1)
	} else {
		customers, _ = models.GetAllCustomers(page, sort, false, -1)
	}
	if len(customers) == 0 {
		return make([]models.Customer, 0), nil
	}
	return customers, nil
}

// @Title Get Count Customers
// @Description get count Customers
// @Param	keyword		string
// @Success 200 {array} models.Customer
// @router /count [get]
func (controller *CustomerController) GetCountAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	total := make(map[string]interface{})

	keyword := ""
	if keywordP := request.URL.Query().Get("keyword"); keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetCustomerByKeyword(keyword, 1, "notSorting", true, -1)
	} else {
		_, total["total"] = models.GetAllCustomers(1, "notSorting", true, -1)
	}

	return total, nil
}

// @Title createCustomer
// @Description create customers
// @Param	body		body 	models.Customer	true		"body for user content"
// @Success 200 {int} models.User.Id
// @Failure 403 body is empty
// @router / [post]
func (controller *CustomerController) Post(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	log.Print("asdfsaf")
	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var customer models.Customer
	err1 :=  json.Unmarshal(data, &customer)
    
    if err1 != nil {
		log.Println("error:", err1)
	}
	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	customer.Creator = user
	customer.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&customer)
	if err != nil {
		return nil, &handler.Error{err, "Validation Errors", http.StatusBadRequest}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusBadRequest}
		}
		return nil, &handler.Error{nil, "Entity not found", http.StatusNoContent}
	} else {
		models.AddCustomer(&customer)
		for i := 0; i < len(customer.Contacts); i++ {
			contact := customer.Contacts[i]
			contact.Owner="customer"
			contact.OwnerId=customer.Id
			contact.Creator = user
			contact.Updater = user
			models.AddContact(contact)
		}
	}

	return customer, nil
}

// @Title updateCustomer
// @Description update customers
// @Param	body		body 	models.Customer	true		"body for user content"
// @Success 200 {int} models.User.Id
// @Failure 403 body is empty
// @router /:uid [put]
func (controller *CustomerController) Put(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {

	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var customer models.Customer
	json.Unmarshal(data, &customer)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	customer.Creator = user
	customer.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&customer)
	if err != nil {
		return nil, &handler.Error{err, "Some errors on validation.", http.StatusBadRequest}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusBadRequest}
		}
		return nil, &handler.Error{nil, "Entity not found.", http.StatusNoContent}
	} else {
		models.UpdateCustomer(&customer)
	}

	return customer, nil

}

// @Title delete
// @Description delete the Customer
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (controller *CustomerController) Delete(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]
	customer, err := models.GetCustomer(uid)
	if err != nil {
		return nil, &handler.Error{err, "Entity not found.", http.StatusNoContent}
	}

	models.DeleteCustomer(customer)

	return nil, nil
}

// @Title Get
// @Description get all Invoices
// @Success 200 {object} models.Invoice
// @router /:id/products [get]
func (controller *CustomerController) GetAllContacts(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uidCustomer := v["uid"]
	var contacts []models.Contact = models.GetAllContactByOwner("customer",uidCustomer)
	return contacts, nil
}

