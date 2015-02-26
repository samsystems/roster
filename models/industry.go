package models

import (
	"github.com/astaxie/beego/orm"
	"time"
)

const INDUSTRY_LIMIT int = 20

type Industry struct {
	Id              string   `orm:"pk"`
	Code            int
	Group           string
	Description     string
	Deleted         bool
	Creator         *User  `orm:"rel(one)" valid:"Entity(Creator)"`
	Updater         *User  `orm:"rel(one)" valid:"Entity(Updater)"`
	Created         time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone int
	Updated         time.Time `orm:"auto_now_add;type(datetime)"`
	UpdatedTimeZone int
}

func init() {
	orm.RegisterModel(new(Industry))
}

func GetAllIndustries() []*Industry {
	o := orm.NewOrm()

	var industries []*Industry
	qs := o.QueryTable("industry")
	qs.Filter("deleted", false).All(&industries)

	return industries
}

func GetIndustriesByKeyword(keyword string, page int, order string, count bool, limit int) ([]Industry, interface{}) {
	if limit < 0 {
		limit = STATE_LIMIT
	}
	var industries []Industry
	qb, _ := orm.NewQueryBuilder("mysql")
	page -= 1
	// Construct query object
	if count == false {
		qb.Select("*")
	} else {
		qb.Select("count(s.id)")
	}

	qb.From("industry s").
		Where("s.description LIKE ?")

	if count == true {
		sql := qb.String()
		var total int
		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRow(&total)
		return industries, total

	} else {
		ParseQueryBuilderOrder(qb, order, "c")
		qb.Limit(limit).Offset(page * INDUSTRY_LIMIT)

		// export raw query string from QueryBuilder object
		sql := qb.String()

		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRows(&industries)
		return industries, nil
	}

}
