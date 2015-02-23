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
)

type GroupController struct {
}

func (controller *GroupController) RegisterHandlers(r *mux.Router) {
	r.Handle("/group/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Get)).Methods("GET")
	r.Handle("/group", handler.New(controller.GetAll)).Methods("GET")
	r.Handle("/group", handler.New(controller.Put)).Methods("PUT")
	r.Handle("/group/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Delete)).Methods("DELETE")
	r.Handle("/group/count", handler.New(controller.Count)).Methods("GET")
}

// @Title Get
// @Description get group by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Group
// @Failure 403 :uid is empty
// @router /:uid [get]
func (controller *GroupController) Get(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	group, err := models.GetGroup(uid)
	if err != nil {
		// TODO: improve error
		return nil, &handler.Error{err, "Error querying database", http.StatusInternalServerError}
	}

	return group, nil
}

// @Title Get
// @Description get all Groups
// @Success 200 {array} models.Group
// @router / [get]
func (controller *GroupController) GetAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	groups := models.GetAllGroups()
	return groups, nil
}

// @Title Get Count Groups
// @Description get count Groups
// @Param	keyword		string
// @Success 200 {array} models.Group
// @router /count [get]
func (controller *GroupController) Count(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	total := make(map[string]interface{})

	keyword := ""
	if keywordP := v["keyword"]; keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetGroupByKeyword(keyword, 1, "notSorting", true, -1)
	} else {
		total["total"] = models.GetAllGroups()
	}

	return total, nil
}

// @Title updateGroup
// @Description update groups
// @Param	body		body 	models.Group	true		"body for user content"
// @Success 200 {int} models.Group.Id
// @Failure 403 body is empty
// @router /:uid [put]
func (controller *GroupController) Put(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {

	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var group models.Group
	json.Unmarshal(data, &group)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	group.Creator = user
	group.Updater = user

	// TODO: improve errors
	valid := validation.Validation{}
	b, err := valid.Valid(&group)
	if err != nil {
		return nil, &handler.Error{err, "Validation Errors", http.StatusBadRequest}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusNoContent}
		}
		return nil, &handler.Error{nil, "Entity not found", http.StatusNoContent}
	} else {
		models.UpdateGroup(&group)
	}

	return group, nil
}

// @Title delete
// @Description delete the Group
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (controller *GroupController) Delete(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	group, err := models.GetGroup(uid)
	if err != nil {
		// TODO: improve error
		return nil, &handler.Error{err, "Invalid customer id", http.StatusBadRequest}
	}

	models.DeleteGroup(group)

	return nil, nil
}
