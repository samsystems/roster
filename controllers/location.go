package controllers

import (
	"github.com/gorilla/mux"
	"net/http"

	"encoding/json"
	"io/ioutil"

	"appengine"

	"handler"
	"log"
	"models"
	"validation"
)

// Operations about Locations
type LocationController struct {
}

func (controller *LocationController) RegisterHandlers(r *mux.Router) {
	r.Handle("/location/count", handler.New(controller.GetCountAll)).Methods("GET")
	r.Handle("/location/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Get)).Methods("GET")
	r.Handle("/location", handler.New(controller.GetAll)).Methods("GET")
	r.Handle("/location", handler.New(controller.Post)).Methods("POST")
	r.Handle("/location/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Put)).Methods("PUT")
	r.Handle("/location/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Delete)).Methods("DELETE")
}

// @Title Get
// @Description get location by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Location
// @Failure 403 :uid is empty
// @router /:uid [get]
func (controller *LocationController) Get(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	location, err := models.GetLocation(uid)
	if err != nil {
		return nil, &handler.Error{err, "Error querying database", http.StatusInternalServerError}
	}

	return location, nil

}

// @Title Get
// @Description get all Locations
// @Param	page	    int
// @Param	sort		string
// @Param	keyword		string
// @Success 200 {array} models.Location
// @router / [get]
func (controller *LocationController) GetAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	var locations []models.Location
	page, sort, keyword := ParseParamsOfGetRequest(request.URL.Query())

	if keyword != "" {
		locations, _ = models.GetLocationByKeyword(keyword, page, sort, false, -1)
	} else {
		locations, _ = models.GetAllLocations(page, sort, false, -1)
	}
	if len(locations) == 0 {
		return make([]models.Location, 0), nil
	}
	return locations, nil
}

// @Title Get Count Locations
// @Description get count Locations
// @Param	keyword		string
// @Success 200 {array} models.Location
// @router /count [get]
func (controller *LocationController) GetCountAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	total := make(map[string]interface{})

	keyword := ""
	if keywordP := request.URL.Query().Get("keyword"); keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetLocationByKeyword(keyword, 1, "notSorting", true, -1)
	} else {
		_, total["total"] = models.GetAllLocations(1, "notSorting", true, -1)
	}

	return total, nil
}

// @Title createLocation
// @Description create locations
// @Param	body		body 	models.Location	true		"body for user content"
// @Success 200 {int} models.User.Id
// @Failure 403 body is empty
// @router / [post]
func (controller *LocationController) Post(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	log.Print("asdfsaf")
	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var location models.Location
	json.Unmarshal(data, &location)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	location.Creator = user
	location.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&location)
	if err != nil {
		return nil, &handler.Error{err, "Validation Errors", http.StatusBadRequest}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusBadRequest}
		}
		return nil, &handler.Error{nil, "Entity not found", http.StatusNoContent}
	} else {
		models.AddLocation(&location)
	}

	return location, nil
}

// @Title updateLocation
// @Description update locations
// @Param	body		body 	models.Location	true		"body for user content"
// @Success 200 {int} models.User.Id
// @Failure 403 body is empty
// @router /:uid [put]
func (controller *LocationController) Put(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {

	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var location models.Location
	json.Unmarshal(data, &location)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	location.Creator = user
	location.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&location)
	if err != nil {
		return nil, &handler.Error{err, "Some errors on validation.", http.StatusBadRequest}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusBadRequest}
		}
		return nil, &handler.Error{nil, "Entity not found.", http.StatusNoContent}
	} else {
		models.UpdateLocation(&location)
	}

	return location, nil

}

// @Title delete
// @Description delete the Location
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (controller *LocationController) Delete(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]
	location, err := models.GetLocation(uid)
	if err != nil {
		return nil, &handler.Error{err, "Entity not found.", http.StatusNoContent}
	}

	models.DeleteLocation(location)

	return nil, nil
}
