package models

import (
	"code.google.com/p/go-uuid/uuid"
	"github.com/astaxie/beego/orm"
	"time"
)

const CUSTOMER_LIMIT int = 20

type Customer struct {
	Id              string   `orm:"pk"`
	Country         *Country `orm:"rel(one)" valid:"Entity(Country)"`
	State           *State   `orm:"rel(one)" valid:"Entity(State)"`
	Creator         *User    `orm:"rel(one)" valid:"Entity(Creator)"`
	Updater         *User    `orm:"rel(one)" valid:"Entity(Updater)"`
	Name            string
	Phone           string
	Mobile          string
	Fax             string
	Email           string
	Address         string
	City            string
	Zipcode         string
	Deleted         time.Time `orm:"type(datetime)"`
	Created         time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone int
	Updated         time.Time `orm:"auto_now;type(datetime)"`
	UpdatedTimeZone int
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

	return &customer, err
}
func GetAllCustomers(page int, order string, count bool, limit int) ([]Customer, interface{}) {
	page -= 1
	if limit < 0 {
		limit = COMPANY_LIMIT
	}
	o := orm.NewOrm()
	var customers []Customer
	qs := o.QueryTable("customer")
	qs = qs.Filter("deleted__isnull", true)
	if count == true {
		cnt, _ := qs.Count()
		return customers, cnt
	} else {
		qs = ParseQuerySetterOrder(qs, order)
		qs.Offset(page * limit).Limit(limit).All(&customers)
		return customers, nil
	}
}

func GetCustomerByKeyword(keyword string, page int, order string, count bool, limit int) ([]Customer, interface{}) {
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
		Where("customer.name LIKE ?")

	if count == true {
		sql := qb.String()
		var total int
		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRow(&total)
		return customers, total

	} else {
		ParseQueryBuilderOrder(qb, order, "customer")
		qb.Limit(limit).Offset(page * CUSTOMER_LIMIT)

		// export raw query string from QueryBuilder object
		sql := qb.String()

		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRows(&customers)
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
