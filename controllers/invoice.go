package controllers

import (
	"encoding/json"
	"github.com/astaxie/beego"

	"github.com/sam/roster/models"
	"github.com/sam/roster/validation"
	"log"
)

// Operations about Users
type InvoiceController struct {
	beego.Controller
}

// @Title Get
// @Description get all Invoices
// @Success 200 {object} models.Invoice
// @router / [get]
func (u *InvoiceController) GetAll() {
	var invoices *[]models.Invoice
	status := u.GetString("status")
	page, sort, keyword := ParseParamsOfGetRequest(u.Input())

	if keyword != "" {
		invoices, _ = models.GetInvoiceByKeyword(status, keyword, page, sort, false, -1)

	} else {
		invoices, _ = models.GetAllInvoices(status, page, sort, false, -1)
	}
	u.Data["json"] = invoices
	u.ServeJson()
	/*


		invoices := models.GetAllInvoices(status)
		u.Data["json"] = invoices

		u.ServeJson()*/
}

// @Title Get
// @Description get invoice by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Invoice
// @Failure 403 :uid is empty
// @router /:uid [get]
func (c *InvoiceController) Get() {
	uid := c.GetString(":uid")
	if uid != "" {
		invoice, err := models.GetInvoice(uid)
		if err != nil {
			c.Data["json"] = err
		} else {
			c.Data["json"] = invoice
		}
	}
	c.ServeJson()
}

// @Title Get Count Invoices
// @Description get count Invoices
// @Param	keyword		string
// @Success 200 {array} models.Invoice
// @router /count [get]
func (g *InvoiceController) GetCountAll() {
	total := make(map[string]interface{})
	status := g.GetString("status")
	keyword := ""
	if keywordP := g.GetString("keyword"); keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetInvoiceByKeyword(status, keyword, 1, "notSorting", true, -1)
	} else {
		_, total["total"] = models.GetAllInvoices(status, 1, "notSorting", true, -1)
	}
	g.Data["json"] = total
	g.ServeJson()
}

// @Title Get Max Order Number from Invoices
// @Description get Max Order Number from Invoices
// @Param	status		string
// @Success 200 int
// @router /max-ordernumber [get]
func (g *InvoiceController) GetMaxOrderNumber() {
	total := make(map[string]interface{})
	total["max"] = models.GetMaxOrderNumber()
	g.Data["json"] = total
	g.ServeJson()
}

// @Title Get Resume from Invoices
// @Description get Resume from Invoices
// @Param	status		string
// @Success int
// @router /resume/:status [get]
func (g *InvoiceController) GetInvoiceResume() {
	status := g.GetString(":status")
	total := make(map[string]interface{})
	total["amount"], total["cant"] = models.GetInvoiceResume(status)
	g.Data["json"] = total
	g.ServeJson()
}

// @Title updateInvoice
// @Description update invoices
// @Param	body		body 	models.Invoice	true		"body for user content"
// @Success 200 {int} models.Invoice.Id
// @Failure 403 body is empty
// @router /:uid [put]
func (g *InvoiceController) Put() {
	var invoice models.Invoice
	json.Unmarshal(g.Ctx.Input.RequestBody, &invoice)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	invoice.Creator = user
	invoice.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&invoice)
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
		models.UpdateInvoice(&invoice)
	}
	g.Data["json"] = invoice
	g.ServeJson()
}

// @Title delete
// @Description delete the Invoice
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (c *InvoiceController) Delete() {
	uid := c.GetString(":uid")
	invoice, err := models.GetInvoice(uid)
	if err != nil {
		c.Abort("403")
	}
	models.DeleteInvoice(invoice)
	c.Data["json"] = "delete success!"
	c.ServeJson()
}

// @Title Create Invoice
// @Description Create Invoice
// @Param	body		body 	models.Invoice	true		"body for invoice content"
// @Success 200 {int} models.Invoice.Id
// @Failure 403 body is empty
// @router / [post]
func (g *InvoiceController) Post() {
	var invoice models.Invoice
	json.Unmarshal(g.Ctx.Input.RequestBody, &invoice)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	invoice.Creator = user
	invoice.Updater = user
	invoice.OrderNumber = models.GetMaxOrderNumber()

	valid := validation.Validation{}
	b, err := valid.Valid(&invoice)
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
		models.AddInvoice(&invoice)
	}
	g.Data["json"] = invoice
	g.ServeJson()
}
