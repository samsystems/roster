package controllers

import (
	"github.com/sam/roster/models"

	"github.com/astaxie/beego"
)

// Operations about Users
type MagentoAccountController struct {
	beego.Controller
}

// @Title Get
// @Description get all Magento Accounts
// @Success 200 {object} models.MagentoAccount
// @router / [get]
func (c *MagentoAccountController) GetAll() {

	accounts := models.GetAllUsers()
	c.Data["json"] = accounts

	c.ServeJson()
}
