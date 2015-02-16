package models

import (
	"code.google.com/p/go-uuid/uuid"
	"time"
)

const GROUP_LIMIT int = 20

func init() {
}

type Group struct {
	Id              string `orm:"pk"`
	Creator         *User  `orm:"rel(one)" valid:"Entity(Creator)"`
	Updater         *User  `orm:"rel(one)" valid:"Entity(Updater)"`
	Name            string
	Description     string
	Homepage        string
	Email           string
	NameId          string
	Contactable     string
	Deleted         time.Time `orm:"type(datetime)"`
	Created         time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone int
	Updated         time.Time `orm:"auto_now_add;type(datetime)"`
	UpdatedTimeZone int
}

func AddGroup(g *Group) string {
	o := orm.NewOrm()
	g.Id = uuid.New()
	_, err := o.Insert(g)
	if err != nil {
		panic(err)
	}
	return g.Id
}

func GetGroup(uid string) (*Group, error) {
	g := Group{Id: uid}
	o := orm.NewOrm()
	err := o.Read(&g)

	return &g, err
}

func GetAllGroups() []*Group {
	o := orm.NewOrm()

	var groups []*Group
	qs := o.QueryTable("group")
	qs.Filter("deleted__isnull", true).All(&groups)

	return groups
}

func GetGroupByKeyword(keyword string, page int, order string, count bool, limit int) (*[]Group, interface{}) {
	var groups []Group
	qb, _ := orm.NewQueryBuilder("mysql")
	page -= 1
	if limit < 0 {
		limit = GROUP_LIMIT
	}
	// Construct query object
	if count == false {
		qb.Select("g.*")
	} else {
		qb.Select("count(g.id)")
	}

	qb.From("group g").
		Where("g.name LIKE ?")

	if count == true {
		sql := qb.String()
		var total int
		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRow(&total)
		return &groups, total

	} else {
		ParseQueryBuilderOrder(qb, order, "g")
		qb.Limit(limit).Offset(page * GROUP_LIMIT)

		// export raw query string from QueryBuilder object
		sql := qb.String()

		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRows(&groups)
		return &groups, nil
	}

}

func UpdateGroup(g *Group) {
	o := orm.NewOrm()
	o.Update(g)
}

func DeleteGroup(g *Group) {
	o := orm.NewOrm()
	g.Deleted = time.Now()
	o.Update(g)
}
