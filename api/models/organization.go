package models

import (
	"github.com/astaxie/beego/orm"
	"time"
)

type Organization struct {
	Id              string `orm:"pk"`
	Creator         *User  `orm:"rel(one)"`
	Updater         *User  `orm:"rel(one)"`
	Name            string
	Deleted         bool
	Created         time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone int
	Updated         time.Time `orm:"auto_now_add;type(datetime)"`
	UpdatedTimeZone int
}

func init() {
	orm.RegisterModel(new(Organization))
}

func OrganizationGet(uid string) (*Organization, error) {
	or := Organization{Id: uid}
	o := orm.NewOrm()
	err := o.Read(&or)
	return &or, err
}
