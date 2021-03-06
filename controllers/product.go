package controllers

import (
	"appengine"
	"encoding/csv"
	"encoding/json"
	"github.com/gorilla/mux"
	"handler"
	"io/ioutil"
	"log"
	"models"
	"net/http"
	//"os"
	"bytes"
	"strconv"
	"validation"
)

type ProductController struct {
}

func (controller *ProductController) RegisterHandlers(r *mux.Router) {
	r.Handle("/product/count", handler.New(controller.Count)).Methods("GET")
	r.Handle("/export-csv/product", handler.New(controller.Export)).Methods("GET")
	//	r.Handle("/product/import", handler.New(controller.ImportProduct)).Methods("GET")
	r.Handle("/product/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Get)).Methods("GET")
	r.Handle("/product", handler.New(controller.GetAll)).Methods("GET")
	r.Handle("/product", handler.New(controller.Post)).Methods("POST")
	r.Handle("/product/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Put)).Methods("PUT")
	r.Handle("/product/{uid:[a-zA-Z0-9\\-]+}", handler.New(controller.Delete)).Methods("DELETE")
	r.Handle("/product/{uid:[a-zA-Z0-9\\-]+}/variations", handler.New(controller.GetAllProductVariations)).Methods("GET")
	r.Handle("/product/{uid:[a-zA-Z0-9\\-]+}/variations", handler.New(controller.NewProductVariations)).Methods("POST")

}

// @Title Get
// @Description get product by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Product
// @Failure 403 :uid is empty
// @router /:uid [get]
func (controller *ProductController) Get(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

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
	var products []models.Product
	page, sort, keyword := ParseParamsOfGetRequest(request.URL.Query())

	user, _ := models.GetCurrentUser(request)

	if keyword != "" {
		products, _ = models.GetProductByKeyword(keyword, user, page, sort, false, -1)

	} else {
		products, _ = models.GetAllProducts(user, page, sort, false, -1)
	}
	if len(products) == 0 {
		return make([]models.Product, 0), nil
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
	user, _ := models.GetCurrentUser(request)
	keyword := ""
	if keywordP := request.URL.Query().Get("keyword"); keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetProductByKeyword(keyword, user, 1, "notSorting", true, -1)
	} else {
		_, total["total"] = models.GetAllProducts(user, 1, "notSorting", true, -1)
	}

	return total, nil
}

// @Title Get
// @Description get all Products Variations by Product
// @Success 200 {object} models.Product
//@Param  uid		string
// @router / [get]
func (controller *ProductController) GetAllProductVariations(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uidProduct := v["uid"]
	variations, _ := models.GetAllProductVariationsByProduct(uidProduct)
	return variations, nil
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

	user, _ := models.GetCurrentUser(request)

	product.Creator = user
	product.Updater = user
	product.Company = user.Company
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
	//json.Unmarshal(data, &product)
	err1 := json.Unmarshal(data, &product)
	if err1 != nil {
		log.Println("error:", err1)
	}
	user, _ := models.GetCurrentUser(request)
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

// @Title updateProduct
// @Description update products
// @Param	body		body 	models.Product	true		"body for user content"
// @Success 200 {int} models.Product.Id
// @Failure 403 body is empty
// @router / [post]
func (controller *ProductController) NewProductVariations(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var productVariation models.ProductVariation
	json.Unmarshal(data, &productVariation)

	user, _ := models.GetCurrentUser(request)
	productVariation.Creator = user
	productVariation.Updater = user
	productVariation.Product, _ = models.GetProduct(uid)

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
func (controller *ProductController) Export(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	var products []models.Product
	user, _ := models.GetCurrentUser(request)
	products, _ = models.GetAllProductsWithoutPagination(user)
	category := []string{"Other", "Product", "Service"}
	csvfile := &bytes.Buffer{} // creates IO Writer
	records := [][]string{{"Name", "Category", "Cost", "Price", "Variation", "Sku", "Stock", "Alert Flag"}}
	for i := 0; i < len(products); i++ {
		variations, _ := models.GetAllProductVariationsByProduct(products[i].Id)
		if len(variations) == 0 {
			records = append(records, []string{products[i].Name, category[products[i].Category], strconv.FormatFloat(float64(products[i].Cost), 'f', 2, 32), strconv.FormatFloat(float64(products[i].Price), 'f', 2, 32)})
		} else {
			for j := 0; j < len(variations); j++ {
				records = append(records, []string{products[i].Name, category[products[i].Category], strconv.FormatFloat(float64(products[i].Cost), 'f', 2, 32), strconv.FormatFloat(float64(products[i].Price), 'f', 2, 32),
					variations[j].Variation, variations[j].Sku, strconv.Itoa(variations[j].Stock), strconv.Itoa(variations[j].AlertAt)})
			}
		}
	}
	writer1 := csv.NewWriter(csvfile)
	writer1.Comma = '\t'
	err := writer1.WriteAll(records) // flush everything into csvfile
	if err != nil {
		log.Println("Error:", err)
		return nil, &handler.Error{err, "Could not write the record to csv file.", http.StatusBadRequest}
	}

	return csvfile.Bytes(), nil
}

// @Title updateProduct
// @Description update products
// @Param	body		body 	models.Product	true		"body for user content"
// @Success 200 {int} models.Product.Id
// @Failure 403 body is empty
// @router / [post]
//func (controller *ProductController) ImportProduct(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
//	csvfile, err := os.Open("db/product.csv")
//
//	if err != nil {
//		log.Print(err)
//		return "some string", nil
//	}
//
//	defer csvfile.Close()
//
//	reader := csv.NewReader(csvfile)
//	reader.Comma = '\t'
//
//	rawCSVdata, err := reader.ReadAll()
//
//	if err != nil {
//		log.Print(err)
//		os.Exit(1)
//	}
//user, _ := models.GetCurrentUser(request)
//	company, _ := models.GetCompany("242495b7-69f4-4107-a4d8-850540e6b834")
//	for _, each := range rawCSVdata {
//		product := models.Product{}
//		product.Creator = user
//		product.Updater = user
//		product.Company = company
//		product.Category = 1
//		product.Name = each[1]
//		temp, _ := strconv.ParseFloat(each[17], 32)
//		product.Cost = float32(temp)
//		temp, _ = strconv.ParseFloat(each[15], 32)
//		product.Price = float32(temp)
//		valid := validation.Validation{}
//		b, err := valid.Valid(&product)
//		if err != nil {
//			log.Print("Some errors on validation")
//		}
//		if !b {
//			for _, err := range valid.Errors {
//				log.Print(err.Message)
//			}
//			log.Print("Entity not found")
//		} else {
//			models.AddProduct(&product)
//		}
//		//variations
//		productVariation := models.ProductVariation{}
//
//		productVariation.Creator = user
//		productVariation.Updater = user
//		productVariation.Product = &product
//		productVariation.Stock, _ = strconv.Atoi(each[11])
//		productVariation.Sku = each[0]
//		productVariation.Variation = each[2]
//		valid = validation.Validation{}
//		b, err = valid.Valid(&productVariation)
//		if err != nil {
//			return nil, &handler.Error{err, "Validation Errors", http.StatusBadRequest}
//		}
//		if !b {
//			for _, err := range valid.Errors {
//				return nil, &handler.Error{nil, err.Message, http.StatusBadRequest}
//			}
//			return nil, &handler.Error{nil, "Entity not found", http.StatusNoContent}
//		} else {
//			models.AddProductVariation(&productVariation)
//		}
//	}
//	// sanity check, display to standard output
//	//	for _, each := range rawCSVdata {
//	//		log.Print("email : %s and timestamp : %s\n", each[0], each[1])
//	//	}
//
//	return "some string", nil
//}
