package controllers

import (
	"github.com/gorilla/mux"
	"net/http"

	"appengine"

	"strconv"

	"github.com/samsystems/roster/handler"
	"github.com/samsystems/roster/models"
)

type IndustryController struct {
}

func (controller *IndustryController) RegisterHandlers(r *mux.Router) {
	r.Handle("/industry/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Get)).Methods("GET")
	r.Handle("/industry", handler.New(controller.GetAll)).Methods("GET")
	r.Handle("/industry/find-count/{keyword}", handler.New(controller.GetCountByKeyWord)).Methods("GET")
	r.Handle("/industry/search/{keyword}/{page}/{order}", handler.New(controller.GetByKeyWord)).Methods("GET")
}

// @Title Get
// @Description get Country by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Country
// @Failure 403 :uid is empty
// @router /:uid [get]
func (c *IndustryController) Get(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	industry, err := models.CountryGet(uid)
	if err != nil {
		// TODO: improve error
		return nil, &handler.Error{err, "Error querying database", http.StatusInternalServerError}
	}

	return industry, nil
}

// @Title Get
// @Description get all Countries
// @Success 200 {array} models.Country
// @router / [get]
func (c *IndustryController) GetAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	industries := models.GetAllIndustries()
	return industries, nil
}

// @Title Get
// @Description get all Companies
// @Success 200 {array} models.Country
// @router /search/:keyword/:page/:order [get]
func (c *IndustryController) GetByKeyWord(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	page, _ := strconv.Atoi(v["page"])
	industries, _ := models.GetIndustriesByKeyword(v["keyword"], page, v["order"], false, -1)
	return industries, nil
}

// @Title Get
// @Description get all Companies
// @Success 200 {int} int
// @router /find-count/:keyword [get]
func (c *IndustryController) GetCountByKeyWord(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	_, total := models.GetIndustriesByKeyword(v["keyword"], 1, "notSorting", true, -1)
	return total, nil
}
