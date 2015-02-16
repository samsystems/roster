package controllers

import (
	"encoding/json"
	"github.com/astaxie/beego"

	"github.com/sam/roster/models"
	"github.com/sam/roster/validation"
	"log"
)

// Operations about Users
type VendorController struct {
	beego.Controller
}

// @Title Get
// @Description get all Vendors
// @Success 200 {object} models.Vendor
// @router / [get]
func (c *VendorController) GetAll() {

	vendors := models.GetAllVendors()
	c.Data["json"] = vendors

	c.ServeJson()
}

// @Title Get
// @Description get vendor by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Vendor
// @Failure 403 :uid is empty
// @router /:uid [get]
func (c *VendorController) Get() {
	uid := c.GetString(":uid")
	if uid != "" {
		vendor, err := models.GetVendor(uid)
		if err != nil {
			c.Data["json"] = err
		} else {
			c.Data["json"] = vendor
		}
	}
	c.ServeJson()
}

// @Title Get Count Vendors
// @Description get count Vendors
// @Param	keyword		string
// @Success 200 {array} models.Vendor
// @router /count [get]
func (g *VendorController) GetCountAll() {
	total := make(map[string]interface{})

	keyword := ""
	if keywordP := g.GetString("keyword"); keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetVendorByKeyword(keyword, 1, "notSorting", true, -1)
	} else {
		total["total"] = models.GetAllVendors()
	}
	g.Data["json"] = total
	g.ServeJson()
}

// @Title updateProduct
// @Description update vendors
// @Param	body		body 	models.Vendor	true		"body for user content"
// @Success 200 {int} models.Vendor.Id
// @Failure 403 body is empty
// @router /:uid [put]
func (g *VendorController) Put() {
	var vendor models.Vendor
	json.Unmarshal(g.Ctx.Input.RequestBody, &vendor)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	vendor.Creator = user
	vendor.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&vendor)
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
		models.UpdateVendor(&vendor)
	}
	g.Data["json"] = vendor
	g.ServeJson()
}

// @Title delete
// @Description delete the Vendor
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (c *VendorController) Delete() {
	uid := c.GetString(":uid")
	vendor, err := models.GetVendor(uid)
	if err != nil {
		c.Abort("403")
	}
	models.DeleteVendor(vendor)
	c.Data["json"] = "delete success!"
	c.ServeJson()
}
