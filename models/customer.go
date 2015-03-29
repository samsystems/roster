package models

import (
	"code.google.com/p/go-uuid/uuid"
	"github.com/astaxie/beego/orm"
	"time"
)

const CUSTOMER_LIMIT int = 20

type Customer struct {
	Id                   string `orm:"pk"`
	Name                 string
	Phone                string
	Mobile               string
	Fax                  string
	CompanyName          string
	WebSite              string
	AccountNumber        string
	BillingLocation      *Location `orm:"null;rel(one)" ` //valid:"Entity(Location)"
	ShippingLocation     *Location `orm:"null;rel(one)"`  // valid:"Entity(Location)"
	IsTaxable            bool
	Tax                  float32 `json:",string"`
	Discount             float32 `json:",string"`
	BankAccount          string
	BankAccountName      string
	BatchPaymentsDetails string
	OutStanding          float64
	OverDue              float64
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
	orm.RegisterModel(new(Customer))
}

func AddCustomer(customer *Customer) string {
	o := orm.NewOrm()
	customer.Id = uuid.New()
	_, err := o.Insert(customer)
	if err != nil {
		panic(err)
	}
	return customer.Id
}

func GetCustomer(uid string) (*Customer, error) {
	customer := Customer{Id: uid}
	o := orm.NewOrm()
	err := o.Read(&customer)
	if customer.BillingLocation != nil {
		o.Read(customer.BillingLocation)
		if customer.BillingLocation.State != nil {
			o.Read(customer.BillingLocation.State)
		}
	}
	if customer.ShippingLocation != nil {
		o.Read(customer.ShippingLocation)
		if customer.ShippingLocation.State != nil {
			o.Read(customer.ShippingLocation.State)
		}
	}

	return &customer, err
}
func GetAllCustomers(user *User, page int, order string, count bool, limit int) ([]Customer, interface{}) {
	page -= 1
	if limit < 0 {
		limit = CUSTOMER_LIMIT
	}
	o := orm.NewOrm()
	var customers []Customer
	qs := o.QueryTable("customer")
	qs = qs.Filter("company", user.Company).Filter("deleted__isnull", true)
	if count == true {
		cnt, _ := qs.Count()
		return customers, cnt
	} else {
		qs = ParseQuerySetterOrder(qs, order)
		qs.Offset(page * limit).Limit(limit).All(&customers)
		return customers, nil
	}
}

func GetCustomerByKeyword(keyword string, user *User, page int, order string, count bool, limit int) ([]Customer, interface{}) {
	var customers []Customer
	qb, _ := orm.NewQueryBuilder("mysql")
	page -= 1
	if limit < 0 {
		limit = CUSTOMER_LIMIT
	}
	// Construct query object
	if count == false {
		qb.Select("customer.*")
	} else {
		qb.Select("count(customer.id)")
	}

	qb.From("customer customer").
		Where("customer.name LIKE ?").And("customer.company_id = ?")

	if count == true {
		sql := qb.String()
		var total int
		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%", user.Company.Id).QueryRow(&total)
		return customers, total

	} else {
		ParseQueryBuilderOrder(qb, order, "customer")
		qb.Limit(limit).Offset(page * CUSTOMER_LIMIT)

		// export raw query string from QueryBuilder object
		sql := qb.String()

		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%", user.Company.Id).QueryRows(&customers)
		return customers, nil
	}

}

func UpdateCustomer(customer *Customer) {
	o := orm.NewOrm()
	o.Update(customer)
}

func DeleteCustomer(customer *Customer) {
	o := orm.NewOrm()
	customer.Deleted = time.Now()
	o.Update(customer)
}
