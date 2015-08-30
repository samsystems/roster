package models

import (
	"orm"
	"time"
)

type DocumentFolder struct {
	Id              string          `orm:"pk"`
	Company         *Company        `orm:"rel(one)"`
	Parent          *DocumentFolder `orm:"rel(one)"`
	Creator         *User           `orm:"rel(one)"`
	Updater         *User           `orm:"rel(one)"`
	Name            string
	Description     string
	CanBeDeleted    bool
	Deleted         bool
	Created         time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone int
	Updated         time.Time `orm:"auto_now_add;type(datetime)"`
	UpdatedTimeZone int
}

func init() {
	orm.RegisterModel(new(DocumentFolder))
}
