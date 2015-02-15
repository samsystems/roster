package controllers

import (
	"encoding/json"
	"github.com/astaxie/beego"

	"github.com/sam/inventory-api/models"
	"github.com/sam/inventory-api/validation"
	"log"
)

// Operations about Group
type GroupController struct {
	beego.Controller
}

// @Title Get
// @Description get group by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Group
// @Failure 403 :uid is empty
// @router /:uid [get]
func (c *GroupController) Get() {
	uid := c.GetString(":uid")
	if uid != "" {
		group, err := models.GetGroup(uid)
		if err != nil {
			c.Data["json"] = err
		} else {
			c.Data["json"] = group
		}
	}
	c.ServeJson()
}

// @Title Get
// @Description get all Groups
// @Success 200 {array} models.Group
// @router / [get]
func (g *GroupController) GetAll() {

	groups := models.GetAllGroups()
	g.Data["json"] = groups
	g.ServeJson()
}

// @Title Get Count Groups
// @Description get count Groups
// @Param	keyword		string
// @Success 200 {array} models.Group
// @router /count [get]
func (g *GroupController) GetCountAll() {
	total := make(map[string]interface{})

	keyword := ""
	if keywordP := g.GetString("keyword"); keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetGroupByKeyword(keyword, 1, "notSorting", true, -1)
	} else {
		total["total"] = models.GetAllGroups()
	}
	g.Data["json"] = total
	g.ServeJson()
}

// @Title updateGroup
// @Description update groups
// @Param	body		body 	models.Group	true		"body for user content"
// @Success 200 {int} models.Group.Id
// @Failure 403 body is empty
// @router /:uid [put]
func (g *GroupController) Put() {
	var group models.Group
	json.Unmarshal(g.Ctx.Input.RequestBody, &group)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	group.Creator = user
	group.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&group)
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
		models.UpdateGroup(&group)
	}
	g.Data["json"] = group
	g.ServeJson()
}

// @Title delete
// @Description delete the Group
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (c *GroupController) Delete() {
	uid := c.GetString(":uid")
	group, err := models.GetGroup(uid)
	if err != nil {
		c.Abort("403")
	}
	models.DeleteGroup(group)
	c.Data["json"] = "delete success!"
	c.ServeJson()
}
