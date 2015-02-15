package controllers

import (
	"encoding/json"
	"github.com/astaxie/beego"

	"github.com/sam/inventory-api/models"
	"github.com/sam/inventory-api/validation"
	"log"
)

// Operations about Users
type ContactController struct {
	beego.Controller
}

// @Title Get
// @Description get contact by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Contact
// @Failure 403 :uid is empty
// @router /:uid [get]
func (c *ContactController) Get() {
	uid := c.GetString(":uid")
	if uid != "" {
		contact, err := models.GetContact(uid)
		if err != nil {
			c.Data["json"] = err
		} else {
			c.Data["json"] = contact
		}
	}
	c.ServeJson()
}

// @Title Get
// @Description get all Contacts
// @Success 200 {object} models.Contact
// @router / [get]
func (u *ContactController) GetAll() {
	contacts := models.GetAllContacts()
	u.Data["json"] = contacts

	u.ServeJson()
}

// @Title Get Count Contacts
// @Description get count Contacts
// @Param	keyword		string
// @Success 200 {array} models.Contact
// @router /count [get]
func (g *ContactController) GetCountAll() {
	total := make(map[string]interface{})

	keyword := ""
	if keywordP := g.GetString("keyword"); keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetContactByKeyword(keyword, 1, "notSorting", true, -1)
	} else {
		total["total"] = models.GetAllContacts()
	}
	g.Data["json"] = total
	g.ServeJson()
}

// @Title updateContact
// @Description update contacts
// @Param	body		body 	models.Contact	true		"body for user content"
// @Success 200 {int} models.Contact.Id
// @Failure 403 body is empty
// @router /:uid [put]
func (g *ContactController) Put() {
	var contact models.Contact
	json.Unmarshal(g.Ctx.Input.RequestBody, &contact)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	contact.Creator = user
	contact.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&contact)
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
		models.UpdateContact(&contact)
	}
	g.Data["json"] = contact
	g.ServeJson()
}

// @Title delete
// @Description delete the Contact
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (c *ContactController) Delete() {
	uid := c.GetString(":uid")
	contact, err := models.GetContact(uid)
	if err != nil {
		c.Abort("403")
	}
	models.DeleteContact(contact)
	c.Data["json"] = "delete success!"
	c.ServeJson()
}
