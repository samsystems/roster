package controllers

import (
	"github.com/gorilla/mux"
	"net/http"
	
	"appengine"
	"handler"
	"models"
)

type CommonController struct {
}

func (controller *CommonController) RegisterHandlers(r *mux.Router) {
	r.Handle("/common/is-unique-value/{key}/{property}/{value}/{idValue:[a-zA-Z0-9\\-]+}", handler.New(controller.IsUnique)).Methods("GET")
}

// @Title IsUnique
// @Description Logs user into the system
// @Success 200 {string} login success
// @Failure 403 entity not exist
// @router /is-unique-value [get]
func (controller *CommonController) IsUnique(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	key := v["key"]
	property := v["property"]
	value := v["value"]
	idValue := v["idValue"]
	isUnique := models.IsUnique(key,property,value,idValue)
	return isUnique, nil
}