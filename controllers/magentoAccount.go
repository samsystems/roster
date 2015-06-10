package controllers

import (
	"github.com/gorilla/mux"
	"net/http"

	"appengine"

	"handler"
	"models"
)

// Operations about Users
type MagentoAccountController struct {
}

func (controller *MagentoAccountController) RegisterHandlers(r *mux.Router) {
	r.Handle("/magento/account", handler.New(controller.GetAll)).Methods("GET")
}

// @Title Get
// @Description get all Magento Accounts
// @Success 200 {object} models.MagentoAccount
// @router / [get]
func (controller *MagentoAccountController) GetAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	accounts := models.GetAllUsersWithoutPagination()

	return accounts, nil
}
