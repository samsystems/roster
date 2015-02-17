package controllers

import (
	"github.com/gorilla/mux"
	"net/http"

	"appengine"

	"strconv"

	"github.com/sam/roster/handler"
	"github.com/sam/roster/models"
)

type StateController struct {
}

func (controller *StateController) RegisterHandlers(r *mux.Router) {
	r.Handle("/state/{uid}", handler.New(controller.Get)).Methods("GET")
	r.Handle("/state", handler.New(controller.GetAll)).Methods("GET")
	r.Handle("/state/find-count", handler.New(controller.Count)).Methods("GET")
	r.Handle("/state/search/{keyword}/{page}/{order}", handler.New(controller.GetByKeyWord)).Methods("GET")
}

// @Title Get
// @Description get State by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.State
// @Failure 403 :uid is empty
// @router /:uid [get]
func (c *StateController) Get(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	state, err := models.StateGet(uid)
	if err != nil {
		// TODO: improve error
		return nil, &handler.Error{err, "Error querying database", http.StatusInternalServerError}
	}

	return state, nil
}

// @Title Get
// @Description get all States
// @Success 200 {array} models.State
// @router / [get]
func (c *StateController) GetAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	states := models.GetAllStates()
	return states, nil
}

// @Title Get
// @Description get all Companies
// @Success 200 {array} models.State
// @router /search/:keyword/:page/:order [get]
func (c *StateController) GetByKeyWord(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	page, _ := strconv.Atoi(v["page"])
	states, _ := models.StateGetByKeyword(v["keyword"], page, v["order"], false, -1)

	return states, nil
}

// @Title Get
// @Description get all Companies
// @Success 200 {int} int
// @router /find-count/:keyword [get]
func (c *StateController) Count(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	_, total := models.StateGetByKeyword(v["keyword"], 1, "notSorting", true, -1)

	return total, nil
}
