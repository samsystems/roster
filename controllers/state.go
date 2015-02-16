package controllers

import (
	"github.com/astaxie/beego"
	"github.com/sam/roster/models"
	"strconv"
)

// Operations about State
type StateController struct {
	beego.Controller
}

// @Title Get
// @Description get State by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.State
// @Failure 403 :uid is empty
// @router /:uid [get]
func (c *StateController) Get() {
	uid := c.GetString(":uid")
	if uid != "" {
		state, err := models.StateGet(uid)
		if err != nil {
			c.Data["json"] = err
		} else {
			c.Data["json"] = state
		}
	}
	c.ServeJson()
}

// @Title Get
// @Description get all States
// @Success 200 {array} models.State
// @router / [get]
func (c *StateController) GetAll() {
	states := models.GetAllStates()
	c.Data["json"] = states
	c.ServeJson()
}

// @Title Get
// @Description get all Companies
// @Success 200 {array} models.State
// @router /search/:keyword/:page/:order [get]
func (c *StateController) GetByKeyWord() {
	page, _ := strconv.Atoi(c.GetString(":page"))
	states, _ := models.StateGetByKeyword(c.GetString(":keyword"), page, c.GetString(":order"), false, -1)
	c.Data["json"] = states
	c.ServeJson()
}

// @Title Get
// @Description get all Companies
// @Success 200 {int} int
// @router /find-count/:keyword [get]
func (c *StateController) GetCountByKeyWord() {
	_, total := models.StateGetByKeyword(c.GetString(":keyword"), 1, "notSorting", true, -1)
	c.Data["json"] = total
	c.ServeJson()
}
