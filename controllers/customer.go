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
	r.Handle("/customer/import", handler.New(controller.Import)).Methods("POST")
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
	user, _ := models.GetCurrentUser(request)
	if keyword != "" {
		customers, _ = models.GetCustomerByKeyword(keyword, user, page, sort, false, -1)
	} else {
		customers, _ = models.GetAllCustomers(user, page, sort, false, -1)
	}
	if len(customers) == 0 {
		return make([]models.Customer, 0), nil
	} else {
		for i := 0; i < len(customers); i++ {
			contacts := models.GetAllContactByOwner("customer", customers[i].Id)
			email := ""
			for j := 0; j < len(contacts); j++ {
				if contacts[j].IncludeEmail {
					if email != "" {
						email += ", "
					}
					email += contacts[j].Email
				}
			}
			customers[i].Emails = email
		}
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
	user, _ := models.GetCurrentUser(request)
	keyword := ""
	if keywordP := request.URL.Query().Get("keyword"); keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetCustomerByKeyword(keyword, user, 1, "notSorting", true, -1)
	} else {
		_, total["total"] = models.GetAllCustomers(user, 1, "notSorting", true, -1)
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

	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var customer models.Customer
	err1 := json.Unmarshal(data, &customer)

	if err1 != nil {
		log.Println("error:", err1)
	}
	user, _ := models.GetCurrentUser(request)
	customer.Creator = user
	customer.Updater = user
	customer.Company = user.Company
	if customer.BillingLocation != nil {
		billingLocation := customer.BillingLocation
		if billingLocation.Country == nil {
			country, _ := models.GetCountry("US")
			billingLocation.Country = country
		}
		billingLocation.Company = user.Company
		billingLocation.Creator = user
		billingLocation.Updater = user
		models.AddLocation(billingLocation)
		customer.BillingLocation = billingLocation
	}
	if customer.ShippingLocation != nil {
		shippingLocation := customer.ShippingLocation
		if shippingLocation.Country == nil {
			country, _ := models.GetCountry("US")
			shippingLocation.Country = country
		}
		shippingLocation.Company = user.Company
		shippingLocation.Creator = user
		shippingLocation.Updater = user
		models.AddLocation(shippingLocation)
		customer.ShippingLocation = shippingLocation
	}
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
			contact.Owner = "customer"
			contact.OwnerId = customer.Id
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
	user, _ := models.GetCurrentUser(request)

	customer.Company = user.Company
	customer.Updater = user

	if customer.BillingLocation != nil {
		billingLocation := customer.BillingLocation
		if billingLocation.Country == nil {
			country, _ := models.GetCountry("US")
			billingLocation.Country = country
		}
		billingLocation.Company = user.Company
		billingLocation.Updater = user
		if billingLocation.Id == "" {
			billingLocation.Creator = user
			models.AddLocation(billingLocation)
		} else {
			models.UpdateLocation(billingLocation)
		}
		customer.BillingLocation = billingLocation
	}
	if customer.ShippingLocation != nil {

		shippingLocation := customer.ShippingLocation
		if shippingLocation.Country == nil {
			country, _ := models.GetCountry("US")
			shippingLocation.Country = country
		}
		shippingLocation.Company = user.Company
		shippingLocation.Updater = user

		if shippingLocation.Id == "" {
			shippingLocation.Creator = user
			models.AddLocation(shippingLocation)

		} else {
			models.UpdateLocation(shippingLocation)
		}
		customer.ShippingLocation = shippingLocation
	}

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
		idsContactDelete := make([]string, len(customer.Contacts))
		models.UpdateCustomer(&customer)

		for i := 0; i < len(customer.Contacts); i++ {
			var contact = customer.Contacts[i]
			contact.OwnerId = customer.Id
			contact.Owner = "customer"
			contact.Updater = user

			if contact.Id != "" {
				models.UpdateContact(contact)
			} else {
				contact.Creator = user
				models.AddContact(contact)
			}
			idsContactDelete[i] = contact.Id
		}
		if len(idsContactDelete) > 0 {
			contactDelete := models.GetAllContactToDeleteByIds("customer", customer.Id, idsContactDelete)
			for i := 0; i < len(contactDelete); i++ {
				models.DeleteContact(&contactDelete[i])
			}
		}
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
	var contacts []models.Contact = models.GetAllContactByOwner("customer", uidCustomer)
	return contacts, nil
}

func (controller *CustomerController) Import(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {

	err := request.ParseMultipartForm(100000)

	if err != nil {
		http.Error(writer, err.Error(), http.StatusInternalServerError)
		return nil, nil
	}

	//get a ref to the parsed multipart form
	dataForm := request.MultipartForm
	files := dataForm.File["fileUpload"]
	if files != nil {
		file, err := files[0].Open()
		defer file.Close()

		if err != nil {
			http.Error(writer, err.Error(), http.StatusInternalServerError)
		}
	}
	return nil, nil

}
