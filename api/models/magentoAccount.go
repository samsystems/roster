package models

import (
	"github.com/astaxie/beego/orm"
	"time"
)

type MagentoAccount struct {
	Id              string `orm:"pk"`
	Creator         *User  `orm:"rel(one)"`
	Updater         *User  `orm:"rel(one)"`
	Host            string
	Username        string
	Password        string
	Created         time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone int
	Updated         time.Time `orm:"auto_now_add;type(datetime)"`
	UpdatedTimeZone int
	Deleted         bool
}

func init() {
	orm.RegisterModel(new(MagentoAccount))
}

func GetAllMagentoAccounts() []*MagentoAccount {
	o := orm.NewOrm()

	var magentoAccounts []*MagentoAccount
	qs := o.QueryTable("magento_account")
	qs.Filter("deleted", false).All(&magentoAccounts)

	return magentoAccounts
}
