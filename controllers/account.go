package controllers

import (
	"appengine"
	"encoding/json"
	"github.com/gorilla/mux"
	"handler"
	"io/ioutil"
	"models"
	"net/http"
	"validation"
)

// Operations about Accounts
type AccountController struct {
}

func (controller *AccountController) RegisterHandlers(r *mux.Router) {
	r.Handle("/account/count", handler.New(controller.GetCountAll)).Methods("GET")
	r.Handle("/account/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Get)).Methods("GET")
	r.Handle("/account", handler.New(controller.GetAll)).Methods("GET")
	r.Handle("/account", handler.New(controller.Post)).Methods("POST")
	r.Handle("/account/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Put)).Methods("PUT")
	r.Handle("/account/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Delete)).Methods("DELETE")
}

// @Title Get
// @Description get account by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Account
// @Failure 403 :uid is empty
// @router /:uid [get]
func (controller *AccountController) Get(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	account, err := models.GetAccount(uid)
	if err != nil {
		return nil, &handler.Error{err, "Error querying database", http.StatusInternalServerError}
	}

	return account, nil

}

// @Title Get
// @Description get all Accounts
// @Param	page	    int
// @Param	sort		string
// @Param	keyword		string
// @Success 200 {array} models.Account
// @router / [get]
func (controller *AccountController) GetAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	var accounts []models.Account
	page, sort, keyword := ParseParamsOfGetRequest(request.URL.Query())

	if keyword != "" {
		accounts, _ = models.GetAccountByKeyword(keyword, page, sort, false, -1)
	} else {
		accounts, _ = models.GetAllAccounts(page, sort, false, -1)
	}
	if len(accounts) == 0 {
		return make([]models.Account, 0), nil
	}
	return accounts, nil
}

// @Title Get Count Accounts
// @Description get count Accounts
// @Param	keyword		string
// @Success 200 {array} models.Account
// @router /count [get]
func (controller *AccountController) GetCountAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	total := make(map[string]interface{})

	keyword := ""
	if keywordP := request.URL.Query().Get("keyword"); keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetAccountByKeyword(keyword, 1, "notSorting", true, -1)
	} else {
		_, total["total"] = models.GetAllAccounts(1, "notSorting", true, -1)
	}

	return total, nil
}

// @Title createAccount
// @Description create accounts
// @Param	body		body 	models.Account	true		"body for user content"
// @Success 200 {int} models.User.Id
// @Failure 403 body is empty
// @router / [post]
func (controller *AccountController) Post(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var account models.Account
	json.Unmarshal(data, &account)

	user, _ := models.GetCurrentUser(request)
	account.Creator = user
	account.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&account)
	if err != nil {
		return nil, &handler.Error{err, "Validation Errors", http.StatusBadRequest}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusBadRequest}
		}
		return nil, &handler.Error{nil, "Entity not found", http.StatusNoContent}
	} else {
		models.AddAccount(&account)
	}

	return account, nil
}

// @Title updateAccount
// @Description update accounts
// @Param	body		body 	models.Account	true		"body for user content"
// @Success 200 {int} models.User.Id
// @Failure 403 body is empty
// @router /:uid [put]
func (controller *AccountController) Put(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {

	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var account models.Account
	json.Unmarshal(data, &account)

	user, _ := models.GetCurrentUser(request)
	account.Creator = user
	account.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&account)
	if err != nil {
		return nil, &handler.Error{err, "Some errors on validation.", http.StatusBadRequest}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusBadRequest}
		}
		return nil, &handler.Error{nil, "Entity not found.", http.StatusNoContent}
	} else {
		models.UpdateAccount(&account)
	}

	return account, nil

}

// @Title delete
// @Description delete the Account
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (controller *AccountController) Delete(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]
	account, err := models.GetAccount(uid)
	if err != nil {
		return nil, &handler.Error{err, "Entity not found.", http.StatusNoContent}
	}

	models.DeleteAccount(account)

	return nil, nil
}
