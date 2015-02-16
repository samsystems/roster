package models

import (
	"github.com/astaxie/beego/orm"
	"time"
)

type Document struct {
	Id                string          `orm:"pk"`
	Type              *DocumentType   `orm:"rel(one)"`
	Folder            *DocumentFolder `orm:"rel(one)"`
	Creator           *User           `orm:"rel(one)"`
	Updater           *User           `orm:"rel(one)"`
	Name              string
	Description       string
	FilePath          string
	FileName          string
	MimeType          string
	Date              time.Time `orm:"auto_now_add;type(datetime)"`
	DateTimeZone      int
	Authority         *User `orm:"rel(one)"`
	Hash              string
	ShoreIndexUpdated bool
	Organization      *Organization `orm:"rel(one)"`
	Deleted           bool
	Created           time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone   int
	Updated           time.Time `orm:"auto_now_add;type(datetime)"`
	UpdatedTimeZone   int
}

func init() {
	orm.RegisterModel(new(Document))
}
