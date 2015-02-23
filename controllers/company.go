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
)

type CompanyController struct {
}

func (c *CompanyController) RegisterHandlers(r *mux.Router) {
	r.Handle("/company/count", handler.New(c.GetCountAll)).Methods("GET")
	r.Handle("/company/{uid:[a-zA-Z0-9\\-]+}", handler.New(c.Get)).Methods("GET")
	r.Handle("/company", handler.New(c.GetAll)).Methods("GET")
	r.Handle("/company", handler.New(c.Post)).Methods("POST")
	r.Handle("/company/{uid:[a-zA-Z0-9\\-]+}", handler.New(c.Put)).Methods("PUT")
	r.Handle("/company/{uid:[a-zA-Z0-9\\-]+}", handler.New(c.Delete)).Methods("DELETE")
}

// @Title Get
// @Description get company by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Company
// @Failure 403 :uid is empty
// @router /:uid [get]
func (controller *CompanyController) Get(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	company, err := models.GetCompany(uid)
	if err != nil {
		return nil, &handler.Error{err, "Error querying database", http.StatusInternalServerError}
	}

	return company, nil

}

// @Title Get
// @Description get all Companies
// @Param	page	    int
// @Param	sort		string
// @Param	keyword		string
// @Success 200 {array} models.Company
// @router / [get]
func (controller *CompanyController) GetAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	var companies *[]models.Company
	page, sort, keyword := ParseParamsOfGetRequest(request.URL.Query())

	if keyword != "" {
		companies, _ = models.GetCompanyByKeyword(keyword, page, sort, false, -1)
	} else {
		companies, _ = models.GetAllCompany(page, sort, false, -1)
	}

	return companies, nil
}

// @Title Get Count Companies
// @Description get count Companies
// @Param	keyword		string
// @Success 200 {array} models.Company
// @router /count [get]
func (controller *CompanyController) GetCountAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	total := make(map[string]interface{})

	keyword := ""
	if keywordP := request.URL.Query().Get("keyword"); keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetCompanyByKeyword(keyword, 1, "notSorting", true, -1)
	} else {
		_, total["total"] = models.GetAllCompany(1, "notSorting", true, -1)
	}

	return total, nil
}

// @Title createCompany
// @Description create companies
// @Param	body		body 	models.Company	true		"body for user content"
// @Success 200 {int} models.User.Id
// @Failure 403 body is empty
// @router / [post]
func (controller *CompanyController) Post(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {

	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var company models.Company
	json.Unmarshal(data, &company)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	company.Creator = user
	company.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&company)
	if err != nil {
		return nil, &handler.Error{err, "Validation Errors", http.StatusBadRequest}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusBadRequest}
		}
		return nil, &handler.Error{nil, "Entity not found", http.StatusNoContent}
	} else {
		models.AddCompany(&company)
	}

	return company, nil
}

// @Title updateCompany
// @Description update companies
// @Param	body		body 	models.Company	true		"body for user content"
// @Success 200 {int} models.User.Id
// @Failure 403 body is empty
// @router /:uid [put]
func (controller *CompanyController) Put(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {

	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var company models.Company
	json.Unmarshal(data, &company)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	company.Creator = user
	company.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&company)
	if err != nil {
		return nil, &handler.Error{err, "Some errors on validation.", http.StatusBadRequest}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusBadRequest}
		}
		return nil, &handler.Error{nil, "Entity not found.", http.StatusNoContent}
	} else {
		models.UpdateCompany(&company)
	}

	return company, nil

}

// @Title delete
// @Description delete the Company
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (controller *CompanyController) Delete(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	log.Print(v)
	uid := v["uid"]
	log.Print(v)
	company, err := models.GetCompany(uid)
	if err != nil {
		return nil, &handler.Error{err, "Entity not found.", http.StatusNoContent}
	}

	models.DeleteCompany(company)

	return nil, nil
}
