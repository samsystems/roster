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
)

type VendorController struct {
}

func (controller *VendorController) RegisterHandlers(r *mux.Router) {
	r.Handle("/vendor/count", handler.New(controller.GetCountAll)).Methods("GET")
	r.Handle("/vendor/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Get)).Methods("GET")
	r.Handle("/vendor", handler.New(controller.GetAll)).Methods("GET")
	r.Handle("/vendor", handler.New(controller.Post)).Methods("POST")
	r.Handle("/vendor/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Put)).Methods("PUT")
	r.Handle("/vendor/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Delete)).Methods("DELETE")
	r.Handle("/vendor/{uid:[a-zA-Z0-9\\-]+}/contacts", handler.New(controller.GetAllContacts)).Methods("GET")
}

// @Title Get
// @Description get vendor by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Vendor
// @Failure 403 :uid is empty
// @router /:uid [get]
func (controller *VendorController) Get(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	vendor, err := models.GetVendor(uid)
	if err != nil {
		return nil, &handler.Error{err, "Error querying database", http.StatusInternalServerError}
	}

	return vendor, nil

}

// @Title Get
// @Description get all Vendors
// @Param	page	    int
// @Param	sort		string
// @Param	keyword		string
// @Success 200 {array} models.Vendor
// @router / [get]
func (controller *VendorController) GetAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	var vendors *[]models.Vendor
	page, sort, keyword := ParseParamsOfGetRequest(request.URL.Query())

	if keyword != "" {
		vendors, _ = models.GetVendorByKeyword(keyword, page, sort, false, -1)
	} else {
		vendors, _ = models.GetAllVendors(page, sort, false, -1)
	}

	return vendors, nil
}

// @Title Get Count Vendors
// @Description get count Vendors
// @Param	keyword		string
// @Success 200 {array} models.Vendor
// @router /count [get]
func (controller *VendorController) GetCountAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	total := make(map[string]interface{})

	keyword := ""
	if keywordP := request.URL.Query().Get("keyword"); keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetVendorByKeyword(keyword, 1, "notSorting", true, -1)
	} else {
		_, total["total"] = models.GetAllVendors(1, "notSorting", true, -1)
	}

	return total, nil
}

// @Title createVendor
// @Description create vendors
// @Param	body		body 	models.Vendor	true		"body for user content"
// @Success 200 {int} models.User.Id
// @Failure 403 body is empty
// @router / [post]
func (controller *VendorController) Post(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var vendor models.Vendor
	json.Unmarshal(data, &vendor)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	vendor.Creator = user
	vendor.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&vendor)
	if err != nil {
		return nil, &handler.Error{err, "Validation Errors", http.StatusBadRequest}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusBadRequest}
		}
		return nil, &handler.Error{nil, "Entity not found", http.StatusNoContent}
	} else {
		models.AddVendor(&vendor)
			for i := 0; i < len(vendor.Contacts); i++ {
			contact := vendor.Contacts[i]
			contact.Owner="vendor"
			contact.OwnerId=vendor.Id
			contact.Creator = user
			contact.Updater = user
			models.AddContact(contact)
		}
	}

	return vendor, nil
}

// @Title updateVendor
// @Description update vendors
// @Param	body		body 	models.Vendor	true		"body for user content"
// @Success 200 {int} models.User.Id
// @Failure 403 body is empty
// @router /:uid [put]
func (controller *VendorController) Put(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {

	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var vendor models.Vendor
	json.Unmarshal(data, &vendor)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	vendor.Creator = user
	vendor.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&vendor)
	if err != nil {
		return nil, &handler.Error{err, "Some errors on validation.", http.StatusBadRequest}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusBadRequest}
		}
		return nil, &handler.Error{nil, "Entity not found.", http.StatusNoContent}
	} else {
		models.UpdateVendor(&vendor)
	}

	return vendor, nil

}

// @Title delete
// @Description delete the Vendor
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (controller *VendorController) Delete(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]
	vendor, err := models.GetVendor(uid)
	if err != nil {
		return nil, &handler.Error{err, "Entity not found.", http.StatusNoContent}
	}

	models.DeleteVendor(vendor)

	return nil, nil
}
// @Title Get
// @Description get all Invoices
// @Success 200 {object} models.Invoice
// @router /:id/products [get]
func (controller *VendorController) GetAllContacts(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uidVendor := v["uid"]
	var contacts []models.Contact = models.GetAllContactByOwner("vendor",uidVendor)
	return contacts, nil
}