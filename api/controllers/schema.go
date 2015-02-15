package controllers

import (
	"github.com/astaxie/beego"
	"github.com/sam/inventory-api/models"
)

// Operations about Users
type SchemaController struct {
	beego.Controller
}

// @Title Get
// @updateShema
// @Success 200 {object} models.User
// @router /update [get]
func (u *SchemaController) UpdateSchema() {
	result := models.UpdateSchema()
	u.Data["json"] = result
	u.ServeJson()
}

// @Title Get
// @updateShema
// @Success 200 {object} models.User
// @router /create [get]
func (u *SchemaController) CreateSchema() {
	result := models.CreateSchema()
	u.Data["json"] = result
	u.ServeJson()
}
