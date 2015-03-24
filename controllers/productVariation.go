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

// Operations about ProductVariations
type ProductVariationController struct {
}

func (controller *ProductVariationController) RegisterHandlers(r *mux.Router) {
	r.Handle("/product-variation/count", handler.New(controller.GetCountAll)).Methods("GET")
	r.Handle("/product-variation/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Get)).Methods("GET")
	r.Handle("/product-variation", handler.New(controller.GetAll)).Methods("GET")
	r.Handle("/product-variation", handler.New(controller.Post)).Methods("POST")
	r.Handle("/product-variation/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Put)).Methods("PUT")
	r.Handle("/product-variation/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Delete)).Methods("DELETE")
}

// @Title Get
// @Description get productVariation by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.ProductVariation
// @Failure 403 :uid is empty
// @router /:uid [get]
func (controller *ProductVariationController) Get(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	productVariation, err := models.GetProductVariation(uid)
	if err != nil {
		return nil, &handler.Error{err, "Error querying database", http.StatusInternalServerError}
	}

	return productVariation, nil

}

// @Title Get
// @Description get all ProductVariations
// @Param	page	    int
// @Param	sort		string
// @Param	keyword		string
// @Success 200 {array} models.ProductVariation
// @router / [get]
func (controller *ProductVariationController) GetAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	var productVariations []models.ProductVariation
	page, sort, keyword := ParseParamsOfGetRequest(request.URL.Query())

	if keyword != "" {
		productVariations, _ = models.GetProductVariationByKeyword(keyword, page, sort, false, -1)
	} else {
		productVariations, _ = models.GetAllProductVariations(page, sort, false, -1)
	}
	if len(productVariations) == 0 {
		return make([]models.ProductVariation, 0), nil
	}
	return productVariations, nil
}

// @Title Get Count ProductVariations
// @Description get count ProductVariations
// @Param	keyword		string
// @Success 200 {array} models.ProductVariation
// @router /count [get]
func (controller *ProductVariationController) GetCountAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	total := make(map[string]interface{})

	keyword := ""
	if keywordP := request.URL.Query().Get("keyword"); keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetProductVariationByKeyword(keyword, 1, "notSorting", true, -1)
	} else {
		_, total["total"] = models.GetAllProductVariations(1, "notSorting", true, -1)
	}

	return total, nil
}

// @Title createProductVariation
// @Description create productVariations
// @Param	body		body 	models.ProductVariation	true		"body for user content"
// @Success 200 {int} models.User.Id
// @Failure 403 body is empty
// @router / [post]
func (controller *ProductVariationController) Post(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	log.Print("asdfsaf")
	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var productVariation models.ProductVariation
	json.Unmarshal(data, &productVariation)

	user, _ := models.GetCurrentUser(request)
	productVariation.Creator = user
	productVariation.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&productVariation)
	if err != nil {
		return nil, &handler.Error{err, "Validation Errors", http.StatusBadRequest}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusBadRequest}
		}
		return nil, &handler.Error{nil, "Entity not found", http.StatusNoContent}
	} else {
		models.AddProductVariation(&productVariation)
	}

	return productVariation, nil
}

// @Title updateProductVariation
// @Description update productVariations
// @Param	body		body 	models.ProductVariation	true		"body for user content"
// @Success 200 {int} models.User.Id
// @Failure 403 body is empty
// @router /:uid [put]
func (controller *ProductVariationController) Put(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {

	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var productVariation models.ProductVariation
	json.Unmarshal(data, &productVariation)

	user, _ := models.GetCurrentUser(request)
	productVariation.Creator = user
	productVariation.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&productVariation)
	if err != nil {
		return nil, &handler.Error{err, "Some errors on validation.", http.StatusBadRequest}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusBadRequest}
		}
		return nil, &handler.Error{nil, "Entity not found.", http.StatusNoContent}
	} else {
		models.UpdateProductVariation(&productVariation)
	}

	return productVariation, nil

}

// @Title delete
// @Description delete the ProductVariation
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (controller *ProductVariationController) Delete(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]
	productVariation, err := models.GetProductVariation(uid)
	if err != nil {
		return nil, &handler.Error{err, "Entity not found.", http.StatusNoContent}
	}

	models.DeleteProductVariation(productVariation)

	return nil, nil
}
