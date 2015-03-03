package controllers

import (
	"github.com/gorilla/mux"
	"net/http"

	"encoding/base64"
	"encoding/json"
	"io/ioutil"
	"strings"

	"appengine"

	"handler"
	"log"
	"models"
)

type UserController struct {
}

func (controller *UserController) RegisterHandlers(r *mux.Router) {
	r.Handle("/user/login", handler.New(controller.Login)).Methods("GET")
	r.Handle("/user/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Get)).Methods("GET")
	r.Handle("/user", handler.New(controller.GetAll)).Methods("GET")
	r.Handle("/user", handler.New(controller.Put)).Methods("PUT")
	r.Handle("/user", handler.New(controller.Post)).Methods("POST")
	r.Handle("/user/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Delete)).Methods("DELETE")
	r.Handle("/user/{uid:[a-zA-Z0-9\\-]+}/notifications", handler.New(controller.GetAllUserNotifications)).Methods("GET")
}

// @Title createUser
// @Description create users
// @Param	body		body 	models.User	true		"body for user content"
// @Success 200 {object} models.User
// @Failure 403 body is empty
// @router / [post]
func (controller *UserController) Post(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {

	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var user models.User

	err1 := json.Unmarshal(data, &user)
	if err1 != nil {
		log.Println("error:", err1)
	}
	userSession, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	user.Creator = userSession
	user.Updater = userSession

	if user.Company == nil {
		company, _ := models.GetCompany("242495b7-69f4-4107-a4d8-850540e6b834")
		user.Company = company
	}
	if user.Group == nil {
		group, _ := models.GetGroup("3a12ec14-24df-4926-8b5a-bbd5ff8f2a97")
		user.Group = group
	}

	if user.Country == nil {
		country, _ := models.GetCountry("US")
		user.Country = country
	}
	if user.Username == "" {
		user.Username = user.Email
	}

	models.AddUser(user)

	return user, nil
}

// @Title Get
// @Description get all Users
// @Success 200 {object} models.User
// @router / [get]
func (controller *UserController) GetAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	username := v["username"]

	if username != "" {
		user, _ := models.GetUserByUsername(username)
		return user, nil
	} else {
		users := models.GetAllUsers()
		return users, nil
	}
}

// @Title Get
// @Description get user by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.User
// @Failure 403 :uid is empty
// @router /:uid [get]
func (controller *UserController) Get(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]
	user, err := models.GetUser(uid)
	if err != nil {
		// TODO: adjust error
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	return user, nil
}

// @Title Get by Username
// @Description get user by username
// @Param	username		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.User
// @Failure 403 :username is empty
// @router /find-by-username/:username [get]
func (controller *UserController) GetByUsername(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	username := v["username"]

	user, err := models.GetUserByUsername(username)
	if err != nil {
		// TODO: adjust error
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	return user, nil
}

// @Title update
// @Description update the user
// @Param	uid		path 	string	true		"The uid you want to update"
// @Param	body		body 	models.User	true		"body for user content"
// @Success 200 {object} models.User
// @Failure 403 :uid is not int
// @router /:uid [put]
func (controller *UserController) Put(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var user models.User
	json.Unmarshal(data, &user)

	uu, err := models.UpdateUser(uid, &user)
	if err != nil {
		// TODO: adjust error
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	return uu, nil
}

// @Title delete
// @Description delete the user
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (controller *UserController) Delete(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	models.DeleteUser(uid)

	return nil, nil
}

// @Title login
// @Description Logs user into the system
// @Success 200 {string} login success
// @Failure 403 user not exist
// @router /login [get]
func (controller *UserController) Login(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	user, password := getAuth(writer, request)

	token, err := models.Login(user, password)
	if err != nil {
		return nil, &handler.Error{err, "Error querying database", http.StatusInternalServerError}
	}

	return token, nil
}

// @Title logout
// @Description Logs out current logged in user session
// @Success 200 {string} logout success
// @router /logout [get]
func (controller *UserController) Logout(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	return nil, nil
}

// @Title Get
// @Description get all User Notifications
// @Success 200 {object} models.Notification
// @router /:id/notifications [get]
func (controller *UserController) GetAllUserNotifications(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	// TODO: pass parameters page and read
	notifications := models.GetAllNotificationsByUserId(uid)

	return notifications, nil
}

func getAuth(w http.ResponseWriter, r *http.Request) (string, string) {
	s := strings.SplitN(r.Header.Get("Authorization"), " ", 2)

	// TODO: return errors not empty strings
	if len(s) != 2 {
		return "", ""
	}

	b, err := base64.StdEncoding.DecodeString(s[1])
	if err != nil {
		return "", ""
	}

	pair := strings.SplitN(string(b), ":", 2)
	if len(pair) != 2 {
		return "", ""
	}

	return pair[0], pair[1]
}
