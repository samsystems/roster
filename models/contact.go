package models

import (
	"code.google.com/p/go-uuid/uuid"
	"time"
)

const CONTACT_LIMIT int = 20

type Contact struct {
	Id              string    `orm:"pk"`
	Document        *Document `orm:"rel(one)"`
	Creator         *User     `orm:"rel(one)" valid:"Entity(Creator)"`
	Updater         *User     `orm:"rel(one)" valid:"Entity(Updater)"`
	Name            string
	LastName        string
	Phone           string
	Email           string
	Notes           string
	Position        string
	Owner           *User     `orm:"rel(one)"`
	Deleted         time.Time `orm:"type(datetime)"`
	Created         time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone int
	Updated         time.Time `orm:"auto_now_add;type(datetime)"`
	UpdatedTimeZone int
}

func init() {
}

func AddContact(contact *Contact) string {
	o := orm.NewOrm()
	contact.Id = uuid.New()
	_, err := o.Insert(contact)
	if err != nil {
		panic(err)
	}
	return contact.Id
}

func GetContact(uid string) (*Contact, error) {
	contact := Contact{Id: uid}
	o := orm.NewOrm()
	err := o.Read(&contact)

	return &contact, err
}

func GetAllContacts() []*Contact {
	o := orm.NewOrm()

	var contacts []*Contact
	qs := o.QueryTable("contact")
	qs.Filter("deleted__isnull", true).All(&contacts)

	return contacts
}

func GetContactByKeyword(keyword string, page int, order string, count bool, limit int) (*[]Contact, interface{}) {
	var contacts []Contact
	qb, _ := orm.NewQueryBuilder("mysql")
	page -= 1
	if limit < 0 {
		limit = CUSTOMER_LIMIT
	}
	// Construct query object
	if count == false {
		qb.Select("contact.*")
	} else {
		qb.Select("count(contact.id)")
	}

	qb.From("contact contact").
		Where("contact.name LIKE ?")

	if count == true {
		sql := qb.String()
		var total int
		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRow(&total)
		return &contacts, total

	} else {
		ParseQueryBuilderOrder(qb, order, "contact")
		qb.Limit(limit).Offset(page * CONTACT_LIMIT)

		// export raw query string from QueryBuilder object
		sql := qb.String()

		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRows(&contacts)
		return &contacts, nil
	}

}

func UpdateContact(contact *Contact) {
	o := orm.NewOrm()
	o.Update(contact)
}

func DeleteContact(contact *Contact) {
	o := orm.NewOrm()
	contact.Deleted = time.Now()
	o.Update(contact)
}
