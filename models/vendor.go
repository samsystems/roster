package models

import (
	"code.google.com/p/go-uuid/uuid"
	"github.com/astaxie/beego/orm"
	"time"
)

const VENDOR_LIMIT int = 20

type Vendor struct {
	Id                     string   `orm:"pk"`
	Name                   string
	Phone                  string
	Mobile                 string
	Fax                    string
	CompanyName            string
	WebSite                string
	AccountNumber          string
	Location               *Location   `orm:"rel(one)" valid:"Entity(Location)"`
	TrackTransaction       bool
	TaxId                  string
	BankAccount            string
	BankAccountName        string
	BatchPaymentsDetails   string
	Company                *Company    `orm:"rel(one)" valid:"Entity(Company)"`
	Deleted                time.Time   `orm:"type(datetime)"`
	Creator                *User       `orm:"rel(one)" valid:"Entity(Creator)"`
	Created                time.Time   `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone        int
	Updater                *User       `orm:"rel(one)" valid:"Entity(Updater)"`
	Updated                time.Time   `orm:"auto_now;type(datetime)"`
	UpdatedTimeZone        int
	Contacts                []*Contact     `orm:"-"`
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
	if vendor.Location != nil {
		o.Read(vendor.Location)
		if vendor.Location.State != nil {
			o.Read(vendor.Location.State)
		}
	}
	return &vendor, err
}

func GetAllVendors(page int, order string, count bool, limit int) (*[]Vendor, interface{}) {
	page -= 1
	if limit < 0 {
		limit = COMPANY_LIMIT
	}
	o := orm.NewOrm()
	var vendors []Vendor
	qs := o.QueryTable("vendor")
	qs = qs.Filter("deleted__isnull", true)
	if count == true {
		cnt, _ := qs.Count()
		return &vendors, cnt
	} else {
		qs = ParseQuerySetterOrder(qs, order)
		qs.Offset(page * limit).Limit(limit).All(&vendors)
		return &vendors, nil
	}
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
