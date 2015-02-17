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

// Operations about Customers
type CustomerController struct {
}

func (controller *CustomerController) RegisterHandlers(r *mux.Router) {
	r.Handle("/customer/{uid}", handler.New(controller.Get)).Methods("GET")
	r.Handle("/customer", handler.New(controller.GetAll)).Methods("GET")
	r.Handle("/customer", handler.New(controller.Put)).Methods("PUT")
	r.Handle("/customer/{uid}", handler.New(controller.Delete)).Methods("DELETE")
	r.Handle("/customer/count", handler.New(controller.Count)).Methods("GET")
}

// @Title Get
// @Description get all Customers
// @Success 200 {object} models.Customer
// @router / [get]
func (controller *CustomerController) GetAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	customers := models.GetAllCustomers()

	return customers, nil
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
		// TODO: improve error
		return nil, &handler.Error{err, "Error querying database", http.StatusInternalServerError}
	}

	return customer, nil
}

// @Title Get Count Customers
// @Description get count Customers
// @Param	keyword		string
// @Success 200 {array} models.Customer
// @router /count [get]
func (controller *CustomerController) Count(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	total := make(map[string]interface{})

	keyword := ""
	if keywordP := v["keyword"]; keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetCustomerByKeyword(keyword, 1, "notSorting", true, -1)
	} else {
		total["total"] = models.GetAllCustomers()
	}

	return total, nil
}

// @Title updateCustomers
// @Description update customers
// @Param	body		body 	models.Customer	true		"body for user content"
// @Success 200 {int} models.Customer.Id
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
		return nil, &handler.Error{err, "Validation Errors", http.StatusBadRequest}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusNoContent}
		}
		return nil, &handler.Error{nil, "Entity not found", http.StatusNoContent}
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
		// TODO: improve error
		return nil, &handler.Error{err, "Invalid customer id", http.StatusBadRequest}
	}

	models.DeleteCustomer(customer)

	return nil, nil
}
