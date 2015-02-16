package models

import (
	"code.google.com/p/go-uuid/uuid"
	"github.com/astaxie/beego/orm"
	"time"
)

const NOTIFICATION_LIMIT int = 20

type Notification struct {
	Id              string `orm:"pk"`
	Creator         *User  `orm:"rel(one)" valid:"Entity(Creator)"`
	Updater         *User  `orm:"rel(one)" valid:"Entity(Updater)"`
	Owner           *User  `orm:"rel(one)"`
	Title           string
	Category        string
	Read            string
	Deleted         time.Time `orm:"type(datetime)"`
	Created         time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone int
	Updated         time.Time `orm:"auto_now_add;type(datetime)"`
	UpdatedTimeZone int
}

func init() {
	orm.RegisterModel(new(Notification))
}

func AddNotification(g *Notification) string {
	o := orm.NewOrm()
	g.Id = uuid.New()
	_, err := o.Insert(g)
	if err != nil {
		panic(err)
	}
	return g.Id
}

func GetNotification(uid string) (*Notification, error) {
	g := Notification{Id: uid}
	o := orm.NewOrm()
	err := o.Read(&g)

	return &g, err
}

func GetAllNotifications() []*Notification {
	o := orm.NewOrm()

	var notifications []*Notification
	qs := o.QueryTable("notification")
	qs.Filter("deleted__isnull", true).All(&notifications)

	return notifications
}

func GetAllNotificationsByUserId(userId string) []*Notification {
	o := orm.NewOrm()

	var notifications []*Notification
	qs := o.QueryTable("notification")
	qs.Filter("deleted__isnull", true)
	qs.Filter("owner_id", userId)
	qs.All(&notifications)

	return notifications
}

func GetNotificationByKeyword(keyword string, page int, order string, count bool, limit int) (*[]Notification, interface{}) {
	var notifications []Notification
	qb, _ := orm.NewQueryBuilder("mysql")
	page -= 1
	if limit < 0 {
		limit = NOTIFICATION_LIMIT
	}
	// Construct query object
	if count == false {
		qb.Select("g.*")
	} else {
		qb.Select("count(g.id)")
	}

	qb.From("notification g").
		Where("g.name LIKE ?")

	if count == true {
		sql := qb.String()
		var total int
		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRow(&total)
		return &notifications, total

	} else {
		ParseQueryBuilderOrder(qb, order, "g")
		qb.Limit(limit).Offset(page * NOTIFICATION_LIMIT)

		// export raw query string from QueryBuilder object
		sql := qb.String()

		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRows(&notifications)
		return &notifications, nil
	}

}

func UpdateNotification(g *Notification) {
	o := orm.NewOrm()
	o.Update(g)
}

func DeleteNotification(g *Notification) {
	o := orm.NewOrm()
	g.Deleted = time.Now()
	o.Update(g)
}
