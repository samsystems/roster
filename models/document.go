package models

import (
	"code.google.com/p/go-uuid/uuid"
	"github.com/astaxie/beego/orm"
	"time"
)

type Document struct {
	Id              string        `orm:"pk"`
	Type            *DocumentType `orm:"rel(one)"`
	Creator         *User         `orm:"rel(one)"`
	Updater         *User         `orm:"rel(one)"`
	Name            string
	Description     string
	FilePath        string
	FileName        string
	MimeType        string
	Date            time.Time `orm:"auto_now_add;type(datetime)"`
	DateTimeZone    int
	Authority       *User `orm:"rel(one)"`
	Hash            string
	Organization    *Organization `orm:"rel(one)"`
	Deleted         time.Time     `orm:"type(datetime)"`
	Created         time.Time     `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone int
	Updated         time.Time `orm:"auto_now_add;type(datetime)"`
	UpdatedTimeZone int
}

func init() {
	orm.RegisterModel(new(Document))
}

func GetDocument(uid string) (*Document, error) {
	document := Document{Id: uid}
	o := orm.NewOrm()
	err := o.Read(&document)

	return &document, err
}

func GetAllDocuments() []*Document {
	o := orm.NewOrm()

	var documents []*Document
	qs := o.QueryTable("document")
	qs.Filter("deleted__isnull", true).All(&documents)

	return documents
}

func AddDocument(document *Document) string {
	o := orm.NewOrm()
	document.Id = uuid.New()
	_, err := o.Insert(document)
	if err != nil {
		panic(err)
	}
	return document.Id
}

func UpdateDocument(document *Document) {
	o := orm.NewOrm()
	o.Update(document)
}

func DeleteDocument(document *Document) {
	o := orm.NewOrm()
	document.Deleted = time.Now()
	o.Update(document)
}
