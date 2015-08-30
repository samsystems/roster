package models

import (
	"code.google.com/p/go-uuid/uuid"
	"orm"
	"time"
)

const VENDOR_LIMIT int = 20

type Vendor struct {
	Id                   string `orm:"pk"`
	Name                 string
	Phone                string
	Mobile               string
	Fax                  string
	CompanyName          string
	WebSite              string
	AccountNumber        string
	Location             *Location `orm:"null;rel(one)"` // valid:"Entity(Location)
	TrackTransaction     bool
	TaxId                string
	BankAccount          string
	BankAccountName      string
	BatchPaymentsDetails string
	Company              *Company  `orm:"rel(one)" valid:"Entity(Company)"`
	Deleted              time.Time `orm:"type(datetime)"`
	Creator              *User     `orm:"rel(one)" valid:"Entity(Creator)"`
	Created              time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone      int
	Updater              *User     `orm:"rel(one)" valid:"Entity(Updater)"`
	Updated              time.Time `orm:"auto_now;type(datetime)"`
	UpdatedTimeZone      int
	Contacts             []*Contact `orm:"-"`
	Emails               string     `orm:"-"`
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

func GetAllVendors(user *User, page int, order string, count bool, limit int) ([]Vendor, interface{}) {
	page -= 1
	if limit < 0 {
		limit = VENDOR_LIMIT
	}
	o := orm.NewOrm()
	var vendors []Vendor
	qs := o.QueryTable("vendor")
	qs = qs.Filter("company", user.Company).Filter("deleted__isnull", true)
	if count == true {
		cnt, _ := qs.Count()
		return vendors, cnt
	} else {
		qs = ParseQuerySetterOrder(qs, order)
		qs.Offset(page * limit).Limit(limit).All(&vendors)
		return vendors, nil
	}
}

func GetVendorByKeyword(keyword string, user *User, page int, order string, count bool, limit int) ([]Vendor, interface{}) {

	page -= 1
	if limit < 0 {
		limit = VENDOR_LIMIT
	}
	var vendors []Vendor

	if count == true {
		qb, _ := orm.NewQueryBuilder("mysql")
		qb.Select("count(vendor.id)")
		qb.From("vendor vendor").
			Where("vendor.name LIKE ?").And("vendor.company_id = ?")

		sql := qb.String()
		var total int
		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%", user.Company.Id).QueryRow(&total)
		return vendors, total
	} else {
		o := orm.NewOrm()
		qs := o.QueryTable("vendor")
		qs = qs.Filter("company", user.Company).Filter("deleted__isnull", true).Filter("name__icontains", keyword)
		qs = ParseQuerySetterOrder(qs, order)
		qs.Offset(page * limit).Limit(limit).All(&vendors)
		return vendors, nil

		/*


			ParseQueryBuilderOrder(qb, order, "vendor")
			qb.Limit(limit).Offset(page * VENDOR_LIMIT)
			qb.InnerJoin("location")
			// export raw query string from QueryBuilder object
			sql := qb.String()

			// execute the raw query string
			o := orm.NewOrm()
			o.Raw(sql, "%"+keyword+"%", user.Company.Id).QueryRows(&vendors)
			return vendors, nil*/
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
func GetAllVendorsWithoutPagination(user *User) ([]Vendor, interface{}) {
	o := orm.NewOrm()
	var vendors []Vendor
	querySetter := o.QueryTable("vendor")
	querySetter = querySetter.Filter("company", user.Company).Filter("deleted__isnull", true)
	querySetter = querySetter.RelatedSel("Location").RelatedSel("Company").RelatedSel("Creator").RelatedSel("Updater")
	querySetter.All(&vendors)
	return vendors, nil
}
