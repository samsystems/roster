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
	var vendors []models.Vendor
	page, sort, keyword := ParseParamsOfGetRequest(request.URL.Query())

	if keyword != "" {
		vendors, _ = models.GetVendorByKeyword(keyword, page, sort, false, -1)
	} else {
		vendors, _ = models.GetAllVendors(page, sort, false, -1)
	}
	if len(vendors) == 0 {
		return make([]models.Vendor, 0), nil
	} else {
		for i := 0; i < len(vendors); i++ {
			contacts := models.GetAllContactByOwner("vendor", vendors[i].Id)
			email := ""
			for j := 0; j < len(contacts); j++ {
				if contacts[j].IncludeEmail {
					if email != "" {
						email += ", "
					}
					email += contacts[j].Email
				}
			}
			vendors[i].Emails = email
		}
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

	user, _ := models.GetCurrentUser(request)
	vendor.Creator = user
	vendor.Updater = user
	vendor.Company = user.Company
	if vendor.Location != nil {
		location := vendor.Location
		if location.Country == nil {
			country, _ := models.GetCountry("US")
			location.Country = country
		}
		location.Company = user.Company
		location.Creator = user
		location.Updater = user
		models.AddLocation(location)
		vendor.Location = location
	}
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
			contact.Owner = "vendor"
			contact.OwnerId = vendor.Id
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

	user, _ := models.GetCurrentUser(request)
	vendor.Creator = user
	vendor.Updater = user
	if vendor.Location != nil {
		location := vendor.Location
		if location.Country == nil {
			country, _ := models.GetCountry("US")
			location.Country = country
		}
		location.Company = user.Company
		location.Updater = user
		if location.Id == "NULL" {
			location.Creator = user
			models.AddLocation(location)
		} else {
			models.UpdateLocation(location)
		}
		vendor.Location = location
	}
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

		idsContactDelete := make([]string, len(vendor.Contacts))
		for i := 0; i < len(vendor.Contacts); i++ {
			var contact = vendor.Contacts[i]
			contact.OwnerId = vendor.Id
			contact.Owner = "vendor"
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
			contactDelete := models.GetAllContactToDeleteByIds("vendor", vendor.Id, idsContactDelete)
			for i := 0; i < len(contactDelete); i++ {
				models.DeleteContact(&contactDelete[i])
			}
		}
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
	var contacts []models.Contact = models.GetAllContactByOwner("vendor", uidVendor)
	return contacts, nil
}
