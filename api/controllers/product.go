package controllers

import (
	"encoding/json"
	"github.com/astaxie/beego"

	"github.com/sam/inventory-api/models"
	"github.com/sam/inventory-api/validation"
	"log"
)

// Operations about Users
type ProductController struct {
	beego.Controller
}

// @Title Get
// @Description get product by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Product
// @Failure 403 :uid is empty
// @router /:uid [get]
func (c *ProductController) Get() {
	uid := c.GetString(":uid")
	if uid != "" {
		product, err := models.GetProduct(uid)
		if err != nil {
			c.Data["json"] = err
		} else {
			c.Data["json"] = product
		}
	}
	c.ServeJson()
}

// @Title Get
// @Description get all Products
// @Success 200 {object} models.Product
// @router / [get]
func (c *ProductController) GetAll() {
	var products *[]models.Product
	page, sort, keyword := ParseParamsOfGetRequest(c.Input())

	if keyword != "" {
		products, _ = models.GetProductByKeyword(keyword, page, sort, false, -1)

	} else {
		products, _ = models.GetAllProducts(page, sort, false, -1)
	}
	c.Data["json"] = products
	c.ServeJson()
}

// @Title Get Count Products
// @Description get count Products
// @Param	keyword		string
// @Success 200 {array} models.Product
// @router /count [get]
func (g *ProductController) GetCountAll() {
	total := make(map[string]interface{})

	keyword := ""
	if keywordP := g.GetString("keyword"); keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetProductByKeyword(keyword, 1, "notSorting", true, -1)
	} else {
		_, total["total"] = models.GetAllProducts(1, "notSorting", true, -1)
	}
	g.Data["json"] = total
	g.ServeJson()
}

// @Title updateProduct
// @Description update products
// @Param	body		body 	models.Product	true		"body for user content"
// @Success 200 {int} models.Product.Id
// @Failure 403 body is empty
// @router / [post]
func (g *ProductController) Post() {
	var product models.Product
	json.Unmarshal(g.Ctx.Input.RequestBody, &product)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	product.Creator = user
	product.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&product)
	if err != nil {
		log.Print(err)
		g.CustomAbort(404, "Some errors on validation.")
	}
	if !b {
		for _, err := range valid.Errors {
			g.CustomAbort(404, err.Message)
		}
		g.CustomAbort(404, "Entity not found.")
	} else {
		models.AddProduct(&product)
	}
	g.Data["json"] = product
	g.ServeJson()
}

// @Title updateProduct
// @Description update products
// @Param	body		body 	models.Product	true		"body for user content"
// @Success 200 {int} models.Product.Id
// @Failure 403 body is empty
// @router /:uid [put]
func (g *ProductController) Put() {
	var product models.Product
	json.Unmarshal(g.Ctx.Input.RequestBody, &product)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	product.Creator = user
	product.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&product)
	if err != nil {
		log.Print(err)
		g.CustomAbort(404, "Some errors on validation.")
	}
	if !b {
		for _, err := range valid.Errors {
			g.CustomAbort(404, err.Message)
		}
		g.CustomAbort(404, "Entity not found.")
	} else {
		models.UpdateProduct(&product)
	}
	g.Data["json"] = product
	g.ServeJson()
}

// @Title delete
// @Description delete the Product
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (c *ProductController) Delete() {
	uid := c.GetString(":uid")
	product, err := models.GetProduct(uid)
	if err != nil {
		c.Abort("403")
	}
	models.DeleteProduct(product)
	c.Data["json"] = "delete success!"
	c.ServeJson()
}
