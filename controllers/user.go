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
	"validation"
)

type UserController struct {
}

func (controller *UserController) RegisterHandlers(r *mux.Router) {
	r.Handle("/user/count", handler.New(controller.GetCountAll)).Methods("GET")
	r.Handle("/user/login", handler.New(controller.Login)).Methods("GET")
	r.Handle("/user/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Get)).Methods("GET")
	r.Handle("/user", handler.New(controller.GetAll)).Methods("GET")
	r.Handle("/user/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Put)).Methods("PUT")
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
	userSystem, _ := models.GetUserByUsername("system")
	user.Creator = userSystem
	user.Updater = userSystem

	if user.Group == nil {
		group, _ := models.GetGroupByNameKey("USERS")
		user.Group = group
	}

	if user.Country == nil {
		country, _ := models.GetCountry("US")
		user.Country = country
	}

	user.Username = user.Email
	user.Password = models.EncriptPassword(user.Password)
	models.AddUser(&user)

	location := user.Company.Location
	if location.Country == nil {
		country, _ := models.GetCountry("US")
		location.Country = country
	}
	location.Creator = &user
	location.Updater = &user
	models.AddLocation(location)
	user.Company.Location = location

	company := user.Company
	company.Creator = &user
	company.Updater = &user
	models.AddCompany(company)
	user.Company = company
	location.Company = company
	models.UpdateLocation(location)
	models.UpdateUser(&user)
	return user.Id, nil
}

// @Title Get
// @Description get all Users
// @Success 200 {object} models.User
// @router / [get]
func (controller *UserController) GetAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	//username := v["username"]
	var username = request.URL.Query().Get("username")
	page, sort, keyword := ParseParamsOfGetRequest(request.URL.Query())
	user, _ := models.GetCurrentUser(request)
	var users []models.User
	if username != "" {
		users := make([]*models.User, 1)
		user, _ := models.GetUserByUsername(username)
		users[0] = user
		return users, nil
	} else if keyword != ""{
			users, _ = models.GetUserByKeyword(keyword, user, page, sort, false, -1)
	} else {
		users, _ = models.GetAllUsers(user, 1, "notSorting", false, -1)
	}
	if len(users) == 0 {
			return make([]models.User, 0), nil
		} 
	return users, nil
}


// @Title Get Count Users
// @Description get count Users
// @Param	keyword		string
// @Success 200 {array} models.User
// @router /count [get]
func (controller *UserController) GetCountAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	total := make(map[string]interface{})
	user, _ := models.GetCurrentUser(request)
	keyword := ""
	if keywordP := request.URL.Query().Get("keyword"); keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetUserByKeyword(keyword, user, 1, "notSorting", true, -1)
	} else {
		_, total["total"] = models.GetAllUsers(user, 1, "notSorting", true, -1)
	}

	return total, nil
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
	//	uid := v["uid"]

	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var user models.User
	json.Unmarshal(data, &user)
	valid := validation.Validation{}
	b, err := valid.Valid(&user)
	if err != nil {
		return nil, &handler.Error{err, "Some errors on validation.", http.StatusBadRequest}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusBadRequest}
		}
		return nil, &handler.Error{nil, "Entity not found.", http.StatusNoContent}
	} else {
		models.UpdateUser(&user)
	}


	return user, nil
}

// @Title delete
// @Description delete the user
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (controller *UserController) Delete(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]
	user, err := models.GetUser(uid)
	if err != nil {
		return nil, &handler.Error{err, "Entity not found.", http.StatusNoContent}
	}

	models.DeleteUser(user)

	return nil, nil
}

// @Title login
// @Description Logs user into the system
// @Success 200 {string} login success
// @Failure 403 user not exist
// @router /login [get]
func (controller *UserController) Login(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	username, password := getAuth(writer, request)

	token, err := models.Login(username, password)
	if err != nil {
		return nil, &handler.Error{err, err.Error(), http.StatusInternalServerError}
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
