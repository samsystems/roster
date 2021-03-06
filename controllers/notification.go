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

type NotificationController struct {
}

func (controller *NotificationController) RegisterHandlers(r *mux.Router) {
	r.Handle("/notification/count", handler.New(controller.GetCountAll)).Methods("GET")
	r.Handle("/notification/{nid:[a-zA-Z0-9\\-]+}", handler.New(controller.Get)).Methods("GET")
	r.Handle("/notification", handler.New(controller.GetAll)).Methods("GET")
	r.Handle("/notification", handler.New(controller.Put)).Methods("PUT")
	r.Handle("/notification", handler.New(controller.Post)).Methods("POST")
	r.Handle("/notification/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Delete)).Methods("DELETE")
}

// @Title Get
// @Description get notification by uid
// @Param	nid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Notification
// @Failure 403 :notificationId is empty
// @router /:nid [get]
func (controller *NotificationController) Get(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	nid := v["nid"]

	notification, err := models.GetNotification(nid)
	if err != nil {
		// TODO: improve error
		return nil, &handler.Error{err, "Error querying database", http.StatusInternalServerError}
	}

	return notification, nil
}

// @Title Get
// @Description get all Notifications
// @Success 200 {object} models.Notification
// @router / [get]
func (controller *NotificationController) GetAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {

	var notifications []models.Notification
	page, sort, keyword := ParseParamsOfGetRequest(request.URL.Query())
	user, _ := models.GetCurrentUser(request)

	if keyword != "" {
		notifications, _ = models.GetNotificationByKeyword(keyword, user, page, sort, false, -1)

	} else {
		notifications, _ = models.GetAllNotifications(user, page, sort, false, -1)
	}
	if len(notifications) == 0 {
		return make([]models.Notification, 0), nil
	}
	return notifications, nil
}

// @Title Get Count Notifications
// @Description get count Notifications
// @Param	keyword		string
// @Success 200 {array} models.Notification
// @router /count [get]
func (controller *NotificationController) GetCountAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {

	total := make(map[string]interface{})
	user, _ := models.GetCurrentUser(request)
	keyword := ""
	if keywordP := request.URL.Query().Get("keyword"); keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetNotificationByKeyword(keyword, user, 1, "notSorting", true, -1)
	} else {
		_, total["total"] = models.GetAllNotifications(user, 1, "notSorting", true, -1)
	}

	return total, nil

}

// @Title Create Notification
// @Description update products
// @Param	body		body 	models.Product	true		"body for user content"
// @Success 200 {int} models.Product.Id
// @Failure 403 body is empty
// @router / [post]
func (controller *NotificationController) Post(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {

	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var notification models.Notification
	json.Unmarshal(data, &notification)

	user, _ := models.GetCurrentUser(request)

	notification.Creator = user
	notification.Updater = user
	valid := validation.Validation{}
	b, err := valid.Valid(&notification)
	if err != nil {
		return nil, &handler.Error{err, "Some errors on validation", http.StatusNoContent}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusNoContent}
		}
		return nil, &handler.Error{nil, "Entity not found", http.StatusNoContent}
	} else {
		models.AddNotification(&notification)
	}

	return notification, nil
}

// @Title updateNotification
// @Description update notifications
// @Param	body		body 	models.Notification	true		"body for user content"
// @Success 200 {int} models.Notification.Id
// @Failure 403 body is empty
// @router /:uid [put]
func (controller *NotificationController) Put(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {

	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var notification models.Notification
	json.Unmarshal(data, &notification)

	user, _ := models.GetCurrentUser(request)
	notification.Creator = user
	notification.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&notification)
	if err != nil {
		return nil, &handler.Error{err, "Validation Errors", http.StatusBadRequest}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusNoContent}
		}
		return nil, &handler.Error{nil, "Entity not found", http.StatusNoContent}
	} else {
		models.UpdateNotification(&notification)
	}

	return notification, nil
}

// @Title delete
// @Description delete the Notification
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (controller *NotificationController) Delete(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	notification, err := models.GetNotification(uid)
	if err != nil {
		// TODO: improve error
		return nil, &handler.Error{err, "Invalid notification id", http.StatusBadRequest}
	}

	models.DeleteNotification(notification)

	return nil, nil
}
