package controllers

import (
	"github.com/astaxie/beego"
	"github.com/sam/inventory-api/models"
	"strconv"
)

// Operations about Country
type CountryController struct {
	beego.Controller
}

// @Title Get
// @Description get Country by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Country
// @Failure 403 :uid is empty
// @router /:uid [get]
func (c *CountryController) Get() {
	uid := c.GetString(":uid")
	if uid != "" {
		country, err := models.CountryGet(uid)
		if err != nil {
			c.Data["json"] = err
		} else {
			c.Data["json"] = country
		}
	}
	c.ServeJson()
}

// @Title Get
// @Description get all Countries
// @Success 200 {array} models.Country
// @router / [get]
func (c *CountryController) GetAll() {
	countries := models.GetAllCountries()
	c.Data["json"] = countries
	c.ServeJson()
}

// @Title Get
// @Description get all Companies
// @Success 200 {array} models.Country
// @router /search/:keyword/:page/:order [get]
func (c *CountryController) GetByKeyWord() {
	page, _ := strconv.Atoi(c.GetString(":page"))
	countries, _ := models.CountryGetByKeyword(c.GetString(":keyword"), page, c.GetString(":order"), false, -1)
	c.Data["json"] = countries
	c.ServeJson()
}

// @Title Get
// @Description get all Companies
// @Success 200 {int} int
// @router /find-count/:keyword [get]
func (c *CountryController) GetCountByKeyWord() {
	_, total := models.CountryGetByKeyword(c.GetString(":keyword"), 1, "notSorting", true, -1)
	c.Data["json"] = total
	c.ServeJson()
}
