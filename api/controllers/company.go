package controllers

import (
	"encoding/json"
	"github.com/astaxie/beego"

	"github.com/sam/inventory-api/models"
	"github.com/sam/inventory-api/validation"
	"log"
)

// Operations about Compnay
type CompanyController struct {
	beego.Controller
}

// @Title Get
// @Description get company by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Company
// @Failure 403 :uid is empty
// @router /:uid [get]
func (c *CompanyController) Get() {
	uid := c.GetString(":uid")
	if uid != "" {
		company, err := models.GetCompany(uid)
		if err != nil {
			c.Data["json"] = err
		} else {
			c.Data["json"] = company
		}
	}
	c.ServeJson()
}

// @Title Get
// @Description get all Companies
// @Param	page	    int
// @Param	sort		string
// @Param	keyword		string
// @Success 200 {array} models.Company
// @router / [get]
func (c *CompanyController) GetAll() {
	var companies *[]models.Company
	page, sort, keyword := ParseParamsOfGetRequest(c.Input())
	log.Print(keyword)
	if keyword != "" {
		companies, _ = models.GetCompanyByKeyword(keyword, page, sort, false, -1)
	} else {
		companies, _ = models.GetAllCompany(page, sort, false, -1)
	}
	c.Data["json"] = companies
	c.ServeJson()
}

// @Title Get Count Companies
// @Description get count Companies
// @Param	keyword		string
// @Success 200 {array} models.Company
// @router /count [get]
func (c *CompanyController) GetCountAll() {
	total := make(map[string]interface{})

	keyword := ""
	if keywordP := c.GetString("keyword"); keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetCompanyByKeyword(keyword, 1, "notSorting", true, -1)
	} else {
		_, total["total"] = models.GetAllCompany(1, "notSorting", true, -1)
	}
	c.Data["json"] = total
	c.ServeJson()
}

// @Title createCompany
// @Description create companies
// @Param	body		body 	models.Company	true		"body for user content"
// @Success 200 {int} models.User.Id
// @Failure 403 body is empty
// @router / [post]
func (c *CompanyController) Post() {
	var company models.Company
	json.Unmarshal(c.Ctx.Input.RequestBody, &company)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	company.Creator = user
	company.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&company)
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
		models.AddCompany(&company)
	}
	c.Data["json"] = company
	c.ServeJson()
}

// @Title updateCompany
// @Description update companies
// @Param	body		body 	models.Company	true		"body for user content"
// @Success 200 {int} models.User.Id
// @Failure 403 body is empty
// @router /:uid [put]
func (c *CompanyController) Put() {
	var company models.Company
	json.Unmarshal(c.Ctx.Input.RequestBody, &company)

	user, _ := models.GetUser("5fbec591-acc8-49fe-a44e-46c59cae99f9") //TODO use user in session
	company.Creator = user
	company.Updater = user

	valid := validation.Validation{}
	b, err := valid.Valid(&company)
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
		models.UpdateCompany(&company)
	}
	c.Data["json"] = company
	c.ServeJson()

}

// @Title delete
// @Description delete the Company
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (c *CompanyController) Delete() {
	uid := c.GetString(":uid")
	company, err := models.GetCompany(uid)
	if err != nil {
		c.Abort("403")
	}
	models.DeleteCompany(company)
	c.Data["json"] = "delete success!"
	c.ServeJson()
}
