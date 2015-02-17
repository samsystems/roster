package controllers

import (
	"github.com/gorilla/mux"
	"net/http"

	"encoding/json"
	"io/ioutil"

	"appengine"

	"github.com/sam/roster/handler"
	"github.com/sam/roster/models"
	"github.com/sam/roster/validation"
)

type ProductController struct {
}

func (controller *ProductController) RegisterHandlers(r *mux.Router) {
	r.Handle("/product/count", handler.New(controller.Count)).Methods("GET")
	r.Handle("/product/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Get)).Methods("GET")
	r.Handle("/product", handler.New(controller.GetAll)).Methods("GET")
	r.Handle("/product", handler.New(controller.Post)).Methods("POST")
	r.Handle("/product", handler.New(controller.Put)).Methods("PUT")
	r.Handle("/product/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Delete)).Methods("DELETE")
}

// @Title Get
// @Description get product by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Product
// @Failure 403 :uid is empty
// @router /:uid [get]
func (controller *ProductController) Get(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v[":uid"]

	product, err := models.GetProduct(uid)
	if err != nil {
		return nil, &handler.Error{err, "Error querying database", http.StatusInternalServerError}
	}

	return product, nil
}

// @Title Get
// @Description get all Products
// @Success 200 {object} models.Product
// @router / [get]
func (controller *ProductController) GetAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	var products *[]models.Product
	page, sort, keyword := ParseParamsOfGetRequest(v)

	if keyword != "" {
		products, _ = models.GetProductByKeyword(keyword, page, sort, false, -1)

	} else {
		products, _ = models.GetAllProducts(page, sort, false, -1)
	}

	return products, nil
}

// @Title Get Count Products
// @Description get count Products
// @Param	keyword		string
// @Success 200 {array} models.Product
// @router /count [get]
func (controller *ProductController) Count(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	total := make(map[string]interface{})

	keyword := ""
	if keywordP := v["keyword"]; keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetProductByKeyword(keyword, 1, "notSorting", true, -1)
	} else {
		_, total["total"] = models.GetAllProducts(1, "notSorting", true, -1)
	}

	return total, nil
}

// @Title updateProduct
// @Description update products
// @Param	body		body 	models.Product	true		"body for user content"
// @Success 200 {int} models.Product.Id
// @Failure 403 body is empty
// @router / [post]
func (controller *ProductController) Post(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {

	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var product models.Product
	json.Unmarshal(data, &product)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	product.Creator = user
	product.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&product)
	if err != nil {
		return nil, &handler.Error{err, "Some errors on validation", http.StatusNoContent}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusNoContent}
		}
		return nil, &handler.Error{nil, "Entity not found", http.StatusNoContent}
	} else {
		models.AddProduct(&product)
	}

	return product, nil
}

// @Title updateProduct
// @Description update products
// @Param	body		body 	models.Product	true		"body for user content"
// @Success 200 {int} models.Product.Id
// @Failure 403 body is empty
// @router /:uid [put]
func (controller *ProductController) Put(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {

	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var product models.Product
	json.Unmarshal(data, &product)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	product.Creator = user
	product.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&product)
	if err != nil {
		return nil, &handler.Error{err, "Errors on validation", http.StatusNoContent}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusNoContent}
		}
		return nil, &handler.Error{nil, "Entity not found", http.StatusNoContent}
	} else {
		models.UpdateProduct(&product)
	}

	return product, nil
}

// @Title delete
// @Description delete the Product
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (controller *ProductController) Delete(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	product, err := models.GetProduct(uid)
	if err != nil {
		return nil, &handler.Error{nil, "Entity not found", http.StatusNoContent}
	}
	models.DeleteProduct(product)

	return nil, nil
}
