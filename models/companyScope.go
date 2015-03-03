package models

import (
	"github.com/astaxie/beego/orm"
	"time"
)

type CompanyScope struct {
	Id              string      `orm:"pk"`
	Creator         *User       `orm:"rel(one)"`
	Updater         *User       `orm:"rel(one)"`
	Name            string
	NameKey         string
	Deleted         time.Time    `orm:"type(datetime)"`
	Created         time.Time    `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone int
	Updated         time.Time     `orm:"auto_now_add;type(datetime)"`
	UpdatedTimeZone int
}

func init() {
	orm.RegisterModel(new(CompanyScope))
}

func GetCompanyScope(uid string) (*CompanyScope, error) {
	companyScope := CompanyScope{Id: uid}
	o := orm.NewOrm()
	err := o.Read(&companyScope)

	return &companyScope, err
}
func GetCompanyScopeByNameId(nameId string) (*CompanyScope, error) {
	o := orm.NewOrm()
	companyScope := CompanyScope{}
	qs := o.QueryTable("company_scope")
	err := qs.Filter("deleted__isnull", true).Filter("name_key", nameId).One(&companyScope)

	return &companyScope, err
}

func GetAllCompanyScope() []*CompanyScope {
	o := orm.NewOrm()

	var companiesScope []*CompanyScope
	qs := o.QueryTable("company_scope")
	qs.Filter("deleted__isnull", true).All(&companiesScope)

	return companiesScope
}