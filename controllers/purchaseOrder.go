package controllers

import (
	"encoding/json"
	"github.com/astaxie/beego"

	"github.com/sam/roster/models"
	"github.com/sam/roster/validation"
	"log"
	"strconv"
)

// Operations about Compnay
type PurchaseOrderController struct {
	beego.Controller
}

// @Title Get
// @Description get purchase order by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.PurchaseOrder
// @Failure 403 :uid is empty
// @router /:uid [get]
func (c *PurchaseOrderController) Get() {
	uid := c.GetString(":uid")
	if uid != "" {
		purchaseOrder, err := models.GetPurchaseOrder(uid)
		if err != nil {
			c.Data["json"] = err
		} else {
			c.Data["json"] = purchaseOrder
		}
	}
	c.ServeJson()
}

// @Title Get
// @Description get all Companies
// @Param	page	    int
// @Param	sort		string
// @Param	keyword		string
// @Param	status		string
// @Success 200 {array} models.PurchaseOrder
// @router / [get]
func (c *PurchaseOrderController) GetAll() {
	status := models.PURCHASE_ALL
	if statusP := c.GetString("status"); statusP != "" {
		status, _ = strconv.Atoi(statusP)
	}
	var purchases *[]models.PurchaseOrder
	page, sort, keyword := ParseParamsOfGetRequest(c.Input())
	if keyword != "" {
		purchases, _ = models.GetPurchaseOrderByKeyword(keyword, page, sort, false, -1)
	} else {
		purchases, _ = models.GetAllPurchaseOrder(status, page, sort, false, -1)
	}
	c.Data["json"] = purchases
	c.ServeJson()
}

// @Title Get Count Companies
// @Description get count Companies
// @Param	keyword		string
// @Success 200 {array} models.PurchaseOrder
// @router /count [get]
func (c *PurchaseOrderController) GetCountAll() {
	total := make(map[string]interface{})
	status := models.PURCHASE_ALL
	if statusP := c.GetString("status"); statusP != "" {
		status, _ = strconv.Atoi(statusP)
	}
	keyword := ""
	if keywordP := c.GetString("keyword"); keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetPurchaseOrderByKeyword(keyword, 1, "notSorting", true, -1)
	} else {
		_, total["total"] = models.GetAllPurchaseOrder(status, 1, "notSorting", true, -1)
	}
	c.Data["json"] = total
	c.ServeJson()
}

// @Title Get Resume from Purchases
// @Description get Resume from Purchases
// @Param	status	int
// @Success int
// @router /resume/:status [get]
func (c *PurchaseOrderController) GetResumePurchases() {
	status, _ := strconv.Atoi(c.GetString(":status"))
	total := make(map[string]interface{})
	total["amount"], total["cant"] = models.GetPurchaseResume(status)
	c.Data["json"] = total
	c.ServeJson()
}

// @Title createPurchaseOrder
// @Description create purchases
// @Param	body		body 	models.PurchaseOrder	true		"body for user content"
// @Success 200 {int} models.User.Id
// @Failure 403 body is empty
// @router / [post]
func (c *PurchaseOrderController) Post() {
	var purchaseOrder models.PurchaseOrder
	json.Unmarshal(c.Ctx.Input.RequestBody, &purchaseOrder)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	purchaseOrder.Creator = user
	purchaseOrder.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&purchaseOrder)
	if err != nil {
		log.Print(err)
		c.CustomAbort(404, "Some errors on validation.")
	}
	if !b {
		for _, err := range valid.Errors {
			c.CustomAbort(404, err.Message)
		}
		c.CustomAbort(404, "Entity not found.")
	} else {
		models.AddPurchaseOrder(&purchaseOrder)
	}
	c.Data["json"] = purchaseOrder
	c.ServeJson()
}

// @Title updatePurchaseOrder
// @Description update purchases
// @Param	body		body 	models.PurchaseOrder	true		"body for user content"
// @Success 200 {int} models.User.Id
// @Failure 403 body is empty
// @router /:uid [put]
func (c *PurchaseOrderController) Put() {
	var purchaseOrder models.PurchaseOrder
	json.Unmarshal(c.Ctx.Input.RequestBody, &purchaseOrder)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	purchaseOrder.Creator = user
	purchaseOrder.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&purchaseOrder)
	if err != nil {
		log.Print(err)
		c.CustomAbort(404, "Some errors on validation.")
	}
	if !b {
		for _, err := range valid.Errors {
			c.CustomAbort(404, err.Message)
		}
		c.CustomAbort(404, "Entity not found.")
	} else {
		models.UpdatePurchaseOrder(&purchaseOrder)
	}
	c.Data["json"] = purchaseOrder
	c.ServeJson()

}

// @Title delete
// @Description delete the PurchaseOrder
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (c *PurchaseOrderController) Delete() {
	uid := c.GetString(":uid")
	purchaseOrder, err := models.GetPurchaseOrder(uid)
	if err != nil {
		c.Abort("403")
	}
	models.DeletePurchaseOrder(purchaseOrder)
	c.Data["json"] = "delete success!"
	c.ServeJson()
}
