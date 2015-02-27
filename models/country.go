package models

import (
	"github.com/astaxie/beego/orm"
	"time"
)

const COUNTRY_LIMIT int = 20

type Country struct {
	Iso             string   `orm:"pk"`
	States          []*State `orm:"reverse(many)"`
	Cities          []*City  `orm:"reverse(many)"`
	Name            string
	Iso3            string
	NumCode         int
	Deleted         bool
	Created         time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone int
	Updated         time.Time `orm:"auto_now;type(datetime)"`
	UpdatedTimeZone int
}

func init() {
	orm.RegisterModel(new(Country))
}

func GetCountry(uid string) (*Country, error) {
	c := Country{Iso: uid}
	o := orm.NewOrm()
	err := o.Read(&c)
	return &c, err
}

func GetAllCountries() []*Country {
	o := orm.NewOrm()

	var countries []*Country
	qs := o.QueryTable("country")
	qs.Filter("deleted", false).All(&countries)

	return countries
}

func GetCountryByKeyword(keyword string, page int, order string, count bool, limit int) ([]Country, interface{}) {
	if limit < 0 {
		limit = COUNTRY_LIMIT
	}
	var countries []Country
	qb, _ := orm.NewQueryBuilder("mysql")
	page -= 1
	// Construct query object
	if count == false {
		qb.Select("*")
	} else {
		qb.Select("count(c.id)")
	}

	qb.From("country c").
		Where("c.name LIKE ?")

	if count == true {
		sql := qb.String()
		var total int
		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRow(&total)
		return countries, total

	} else {
		ParseQueryBuilderOrder(qb, order, "c")
		qb.Limit(limit).Offset(page * COUNTRY_LIMIT)

		// export raw query string from QueryBuilder object
		sql := qb.String()

		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRows(&countries)
		return countries, nil
	}

}
