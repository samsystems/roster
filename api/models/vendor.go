package models

import (
	"github.com/astaxie/beego/orm"
	"github.com/sam/inventory-api/go-uuid/uuid"
	"time"
)

const VENDOR_LIMIT int = 20

type Vendor struct {
	Id      string `orm:"pk"`
	Country string
	State   string

	Creator         *User `orm:"rel(one)" valid:"Entity(Creator)"`
	Updater         *User `orm:"rel(one)" valid:"Entity(Updater)"`
	Name            string
	Category        string
	Phone           string
	Fax             string
	Email           string
	Address         string
	City            string
	Zipcode         string
	Notes           string
	Deleted         time.Time `orm:"type(datetime)"`
	Created         time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone int
	Updated         time.Time `orm:"auto_now_add;type(datetime)"`
	UpdatedTimeZone int
}

func init() {
	orm.RegisterModel(new(Vendor))
}

func AddVendor(vendor *Vendor) string {
	o := orm.NewOrm()
	vendor.Id = uuid.New()
	_, err := o.Insert(vendor)
	if err != nil {
		panic(err)
	}
	return vendor.Id
}

func GetVendor(uid string) (*Vendor, error) {
	vendor := Vendor{Id: uid}
	o := orm.NewOrm()
	err := o.Read(&vendor)

	return &vendor, err
}

func GetAllVendors() []*Vendor {
	o := orm.NewOrm()

	var vendors []*Vendor
	qs := o.QueryTable("vendor")
	qs.Filter("deleted__isnull", true).All(&vendors)

	return vendors
}

func GetVendorByKeyword(keyword string, page int, order string, count bool, limit int) (*[]Vendor, interface{}) {
	var vendors []Vendor
	qb, _ := orm.NewQueryBuilder("mysql")
	page -= 1
	if limit < 0 {
		limit = VENDOR_LIMIT
	}
	// Construct query object
	if count == false {
		qb.Select("vendor.*")
	} else {
		qb.Select("count(vendor.id)")
	}

	qb.From("vendor vendor").
		Where("vendor.name LIKE ?")

	if count == true {
		sql := qb.String()
		var total int
		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRow(&total)
		return &vendors, total

	} else {
		ParseQueryBuilderOrder(qb, order, "vendor")
		qb.Limit(limit).Offset(page * VENDOR_LIMIT)

		// export raw query string from QueryBuilder object
		sql := qb.String()

		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRows(&vendors)
		return &vendors, nil
	}

}

func UpdateVendor(vendor *Vendor) {
	o := orm.NewOrm()
	o.Update(vendor)
}

func DeleteVendor(vendor *Vendor) {
	o := orm.NewOrm()
	vendor.Deleted = time.Now()
	o.Update(vendor)
}
