package models

import (
	"orm"
	"time"
)

type DocumentType struct {
	Id              string `orm:"pk"`
	Creator         *User  `orm:"rel(one)"`
	Updater         *User  `orm:"rel(one)"`
	Name            string
	NameId          string
	Description     string
	QuestionSet     *QuestionSet `orm:"rel(one)"`
	Deleted         time.Time    `orm:"type(datetime)"`
	Created         time.Time    `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone int
	Updated         time.Time `orm:"auto_now_add;type(datetime)"`
	UpdatedTimeZone int
}

func init() {
	orm.RegisterModel(new(DocumentType))
}

func GetDocumentType(uid string) (*DocumentType, error) {
	documentType := DocumentType{Id: uid}
	o := orm.NewOrm()
	err := o.Read(&documentType)

	return &documentType, err
}
func GetDocumentTypeByNameId(nameId string) (*DocumentType, error) {
	o := orm.NewOrm()
	documentType := DocumentType{}
	qs := o.QueryTable("document_type")
	err := qs.Filter("deleted__isnull", true).Filter("name_id", nameId).One(&documentType)

	return &documentType, err
}

func GetAllDocumentsType() []*DocumentType {
	o := orm.NewOrm()

	var documentsType []*DocumentType
	qs := o.QueryTable("document_type")
	qs.Filter("deleted__isnull", true).All(&documentsType)

	return documentsType
}
