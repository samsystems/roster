package controllers

import (
	"encoding/json"
	"github.com/astaxie/beego"

	"github.com/sam/inventory-api/models"
	"github.com/sam/inventory-api/validation"
	"log"
)

// Operations about Customers
type CustomerController struct {
	beego.Controller
}

// @Title Get
// @Description get all Customers
// @Success 200 {object} models.Customer
// @router / [get]
func (u *CustomerController) GetAll() {
	customers := models.GetAllCustomers()
	u.Data["json"] = customers

	u.ServeJson()
}

// @Title Get
// @Description get customer by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Customer
// @Failure 403 :uid is empty
// @router /:uid [get]
func (c *CustomerController) Get() {
	uid := c.GetString(":uid")
	if uid != "" {
		customer, err := models.GetCustomer(uid)
		if err != nil {
			c.Data["json"] = err
		} else {
			c.Data["json"] = customer
		}
	}
	c.ServeJson()
}

// @Title Get Count Customers
// @Description get count Customers
// @Param	keyword		string
// @Success 200 {array} models.Customer
// @router /count [get]
func (g *CustomerController) GetCountAll() {
	total := make(map[string]interface{})

	keyword := ""
	if keywordP := g.GetString("keyword"); keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetCustomerByKeyword(keyword, 1, "notSorting", true, -1)
	} else {
		total["total"] = models.GetAllCustomers()
	}
	g.Data["json"] = total
	g.ServeJson()
}

// @Title updateCustomers
// @Description update customers
// @Param	body		body 	models.Customer	true		"body for user content"
// @Success 200 {int} models.Customer.Id
// @Failure 403 body is empty
// @router /:uid [put]
func (g *CustomerController) Put() {
	var customer models.Customer
	json.Unmarshal(g.Ctx.Input.RequestBody, &customer)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	customer.Creator = user
	customer.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&customer)
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
		models.UpdateCustomer(&customer)
	}
	g.Data["json"] = customer
	g.ServeJson()
}

// @Title delete
// @Description delete the Customer
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (c *CustomerController) Delete() {
	uid := c.GetString(":uid")
	customer, err := models.GetCustomer(uid)
	if err != nil {
		c.Abort("403")
	}
	models.DeleteCustomer(customer)
	c.Data["json"] = "delete success!"
	c.ServeJson()
}
