package controllers

import (
	"encoding/json"
	"github.com/astaxie/beego"

	"github.com/sam/inventory-api/models"
	"github.com/sam/inventory-api/validation"
	"log"
)

// Operations about Users
type NotificationController struct {
	beego.Controller
}

// @Title Get
// @Description get notification by uid
// @Param	nid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Notification
// @Failure 403 :notificationId is empty
// @router /:nid [get]
func (n *NotificationController) Get() {
	notificationId := n.GetString(":nid")

	notification, err := models.GetNotification(notificationId)
	if err != nil {
		n.Data["json"] = err
	} else {
		n.Data["json"] = notification
	}

	n.ServeJson()
}

// @Title Get
// @Description get all Notifications
// @Success 200 {object} models.Notification
// @router / [get]
func (n *NotificationController) GetAll() {
	notifications := models.GetAllNotifications()
	n.Data["json"] = notifications

	n.ServeJson()
}

// @Title Get Count Notifications
// @Description get count Notifications
// @Param	keyword		string
// @Success 200 {array} models.Notification
// @router /count [get]
func (g *NotificationController) GetCountAll() {
	total := make(map[string]interface{})

	keyword := ""
	if keywordP := g.GetString("keyword"); keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetNotificationByKeyword(keyword, 1, "notSorting", true, -1)
	} else {
		total["total"] = models.GetAllNotifications()
	}
	g.Data["json"] = total
	g.ServeJson()
}

// @Title updateNotification
// @Description update notifications
// @Param	body		body 	models.Notification	true		"body for user content"
// @Success 200 {int} models.Notification.Id
// @Failure 403 body is empty
// @router /:uid [put]
func (g *NotificationController) Put() {
	var notification models.Notification
	json.Unmarshal(g.Ctx.Input.RequestBody, &notification)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	notification.Creator = user
	notification.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&notification)
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
		models.UpdateNotification(&notification)
	}
	g.Data["json"] = notification
	g.ServeJson()
}

// @Title delete
// @Description delete the Notification
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (c *NotificationController) Delete() {
	uid := c.GetString(":uid")
	notification, err := models.GetNotification(uid)
	if err != nil {
		c.Abort("403")
	}
	models.DeleteNotification(notification)
	c.Data["json"] = "delete success!"
	c.ServeJson()
}
