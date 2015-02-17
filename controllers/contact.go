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

type ContactController struct {
}

func (c *ContactController) RegisterHandlers(r *mux.Router) {
	r.Handle("/contact/{uid:[a-zA-Z0-9\\-]+}", handler.New(c.Get)).Methods("GET")
	r.Handle("/contact", handler.New(c.GetAll)).Methods("GET")
	r.Handle("/contact", handler.New(c.Put)).Methods("PUT")
	r.Handle("/contact/{uid:[a-zA-Z0-9\\-]+}", handler.New(c.Delete)).Methods("DELETE")
	r.Handle("/contact/count", handler.New(c.Count)).Methods("GET")
}

// @Title Get
// @Description get contact by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Contact
// @Failure 403 :uid is empty
// @router /:uid [get]
func (controller *ContactController) Get(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v[":uid"]

	contact, err := models.GetContact(uid)
	if err != nil {
		return nil, &handler.Error{err, "Error querying database", http.StatusInternalServerError}
	}

	return contact, nil
}

// @Title Get
// @Description get all Contacts
// @Success 200 {object} models.Contact
// @router / [get]
func (u *ContactController) GetAll(c appengine.Context, w http.ResponseWriter, r *http.Request, v map[string]string) (interface{}, *handler.Error) {
	// TODO: add filters
	contacts := models.GetAllContacts()

	return contacts, nil
}

// @Title Get Count Contacts
// @Description get count Contacts
// @Param	keyword		string
// @Success 200 {array} models.Contact
// @router /count [get]
func (g *ContactController) Count(c appengine.Context, w http.ResponseWriter, r *http.Request, v map[string]string) (interface{}, *handler.Error) {
	total := make(map[string]interface{})

	keyword := ""
	if keywordP := v["keyword"]; keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetContactByKeyword(keyword, 1, "notSorting", true, -1)
	} else {
		total["total"] = models.GetAllContacts()
	}

	return total, nil
}

// @Title updateContact
// @Description update contacts
// @Param	body		body 	models.Contact	true		"body for user content"
// @Success 200 {int} models.Contact.Id
// @Failure 403 body is empty
// @router /:uid [put]
func (g *ContactController) Put(c appengine.Context, w http.ResponseWriter, r *http.Request, v map[string]string) (interface{}, *handler.Error) {

	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var contact models.Contact
	json.Unmarshal(data, &contact)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	contact.Creator = user
	contact.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&contact)
	if err != nil {
		return nil, &handler.Error{err, "Some errors on validation", http.StatusBadRequest}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusBadRequest}
		}
		return nil, &handler.Error{err, "Entity not found", http.StatusNoContent}
	} else {
		models.UpdateContact(&contact)
	}

	return contact, nil
}

// @Title delete
// @Description delete the Contact
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (controller *ContactController) Delete(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	contact, err := models.GetContact(uid)
	if err != nil {
		return nil, &handler.Error{err, "Entity not found", http.StatusNoContent}
	}

	models.DeleteContact(contact)

	return nil, nil
}
