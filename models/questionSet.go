package models

import (
	"github.com/astaxie/beego/orm"
	"time"
)

type QuestionSet struct {
	Id              string `orm:"pk"`
	Creator         *User  `orm:"rel(one)"`
	Updater         *User  `orm:"rel(one)"`
	Name            string
	NameId          string
	Grouping        string
	Ordering        int32
	Deleted         bool
	Created         time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone int
	Updated         time.Time `orm:"auto_now_add;type(datetime)"`
	UpdatedTimeZone int
}

func init() {
	orm.RegisterModel(new(QuestionSet))
}
