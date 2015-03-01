package controllers

import (
	"github.com/gorilla/mux"
	"net/http"

	"appengine"

	"strconv"

	"handler"
	"models"
)

type CountryController struct {
}

func (controller *CountryController) RegisterHandlers(r *mux.Router) {
	r.Handle("/country/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Get)).Methods("GET")
	r.Handle("/country", handler.New(controller.GetAll)).Methods("GET")
	r.Handle("/country/find-count/{keyword}", handler.New(controller.GetCountByKeyWord)).Methods("GET")
	r.Handle("/country/search/{keyword}/{page}/{order}", handler.New(controller.GetByKeyWord)).Methods("GET")
}

// @Title Get
// @Description get Country by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Country
// @Failure 403 :uid is empty
// @router /:uid [get]
func (c *CountryController) Get(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	country, err := models.GetCountry(uid)
	if err != nil {
		// TODO: improve error
		return nil, &handler.Error{err, "Error querying database", http.StatusInternalServerError}
	}

	return country, nil
}

// @Title Get
// @Description get all Countries
// @Success 200 {array} models.Country
// @router / [get]
func (c *CountryController) GetAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	countries := models.GetAllCountries()
	return countries, nil
}

// @Title Get
// @Description get all Companies
// @Success 200 {array} models.Country
// @router /search/:keyword/:page/:order [get]
func (c *CountryController) GetByKeyWord(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	page, _ := strconv.Atoi(v["page"])
	countries, _ := models.GetCountryByKeyword(v["keyword"], page, v["order"], false, -1)
	return countries, nil
}

// @Title Get
// @Description get all Companies
// @Success 200 {int} int
// @router /find-count/:keyword [get]
func (c *CountryController) GetCountByKeyWord(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	_, total := models.GetCountryByKeyword(v["keyword"], 1, "notSorting", true, -1)
	return total, nil
}
