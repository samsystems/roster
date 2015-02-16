package models

import (
	"code.google.com/p/go-uuid/uuid"
	"time"
)

const COMPANY_LIMIT int = 5

type Company struct {
	Id              string        `orm:"pk"`
	Organization    *Organization `orm:"rel(one)" valid:"Entity(Organization)"`
	Creator         *User         `orm:"rel(one)" valid:"Entity(Creator)"`
	Updater         *User         `orm:"rel(one)" valid:"Entity(Updater)"`
	Name            string
	IntId           int `json:",string"`
	TaxId           string
	Address1        string
	Address2        string
	City            string
	State           *State `orm:"rel(one)" valid:"Entity(State)"`
	ZipCode         string
	Phone           string
	Country         *Country `orm:"rel(one)" valid:"Entity(Country)"`
	Tax             float32  `json:",string"`
	Mobile          string
	Fax             string
	Email           string
	OrderNumber     int       `json:",string"`
	Deleted         time.Time `orm:"type(datetime)"`
	Created         time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone int
	Updated         time.Time `orm:"auto_now;type(datetime)"`
	UpdatedTimeZone int
}

func init() {
}

func GetCompany(uid string) (*Company, error) {
	c := Company{Id: uid}
	o := orm.NewOrm()
	err := o.Read(&c)
	return &c, err
}

func GetAllCompany(page int, order string, count bool, limit int) (*[]Company, interface{}) {
	page -= 1
	if limit < 0 {
		limit = COMPANY_LIMIT
	}
	o := orm.NewOrm()
	var companies []Company
	qs := o.QueryTable("company")
	qs = qs.Filter("deleted__isnull", true)
	if count == true {
		cnt, _ := qs.Count()
		return &companies, cnt
	} else {
		qs = ParseQuerySetterOrder(qs, order)
		qs.Offset(page * limit).Limit(limit).All(&companies)
		return &companies, nil
	}
}

func GetCompanyByKeyword(keyword string, page int, order string, count bool, limit int) (*[]Company, interface{}) {
	var companies []Company
	qb, _ := orm.NewQueryBuilder("mysql")
	page -= 1
	if limit < 0 {
		limit = COMPANY_LIMIT
	}
	// Construct query object
	if count == false {
		qb.Select("c.*")
	} else {
		qb.Select("count(c.id)")
	}

	qb.From("company c").
		LeftJoin("country p").On("c.country_id = p.iso").
		LeftJoin("state s").On("c.state_id = s.id").
		Where("c.name LIKE ?")

	if count == true {
		sql := qb.String()
		var total int
		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRow(&total)
		return &companies, total

	} else {
		ParseQueryBuilderOrder(qb, order, "c")
		qb.Limit(limit).Offset(page * COMPANY_LIMIT)

		// export raw query string from QueryBuilder object
		sql := qb.String()

		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRows(&companies)
		return &companies, nil
	}

}

func AddCompany(c *Company) string {
	o := orm.NewOrm()
	c.Id = uuid.New()
	_, err := o.Insert(c)
	if err != nil {
		panic(err)
	}
	return c.Id
}

func UpdateCompany(c *Company) {
	o := orm.NewOrm()
	o.Update(c)
}

func DeleteCompany(c *Company) {
	o := orm.NewOrm()
	c.Deleted = time.Now()
	o.Update(c)
}
