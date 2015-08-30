package models

import (
	"orm"
	"time"
)

const STATE_LIMIT int = 20

type State struct {
	Id              string   `orm:"pk"`
	Country         *Country `orm:"rel(fk)"`
	Name            string
	AccentName      string
	Deleted         time.Time `orm:"type(datetime)"`
	Created         time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone int
	Updated         time.Time `orm:"auto_now_add;type(datetime)"`
	UpdatedTimeZone int
}

func init() {
	orm.RegisterModel(new(State))
}

func GetState(uid string) (*State, error) {
	c := State{Id: uid}
	o := orm.NewOrm()
	err := o.Read(&c)
	return &c, err
}

func GetAllStates() []*State {
	o := orm.NewOrm()

	var states []*State
	qs := o.QueryTable("state")
	qs.Filter("deleted", false).All(&states)

	return states
}

func GetStateByKeyword(keyword string, page int, order string, count bool, limit int) ([]State, interface{}) {
	if limit < 0 {
		limit = STATE_LIMIT
	}
	var states []State
	qb, _ := orm.NewQueryBuilder("mysql")
	page -= 1
	// Construct query object
	if count == false {
		qb.Select("*")
	} else {
		qb.Select("count(s.id)")
	}

	qb.From("state s").
		Where("s.name LIKE ?")

	if count == true {
		sql := qb.String()
		var total int
		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRow(&total)
		return states, total

	} else {
		ParseQueryBuilderOrder(qb, order, "c")
		qb.Limit(limit).Offset(page * COUNTRY_LIMIT)

		// export raw query string from QueryBuilder object
		sql := qb.String()

		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRows(&states)
		return states, nil
	}

}
