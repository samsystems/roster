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
	o.Read(g.Creator)
	return &g, err
}

func GetAllNotifications(user *User, page int, order string, count bool, limit int) ([]Notification, interface{}) {
	page -= 1
	if limit < 0 {
		limit = NOTIFICATION_LIMIT
	}
	o := orm.NewOrm()
	var notifications []Notification
	querySetter := o.QueryTable("notification")
	querySetter = querySetter.Filter("owner", user).Filter("deleted__isnull", true)
	if count == true {
		cnt, _ := querySetter.Count()
		return notifications, cnt
	} else {
		querySetter = ParseQuerySetterOrder(querySetter, order)
		querySetter.Offset(page * limit).Limit(limit).All(&notifications)
		return notifications, nil
	}
}

func GetNotificationByKeyword(keyword string, user *User, page int, order string, count bool, limit int) ([]Notification, interface{}) {
	var notifications []Notification
	qb, _ := orm.NewQueryBuilder("mysql")
	page -= 1
	if limit < 0 {
		limit = NOTIFICATION_LIMIT
	}
	// Construct query object
	if count == false {
		qb.Select("n.*")
	} else {
		qb.Select("count(n.id)")
	}

	qb.From("notification n").
		Where("n.title LIKE ? or n.category LIKE ?").And("n.owner_id = ?")

	if count == true {
		sql := qb.String()
		var total int
		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%", "%"+keyword+"%", user.Id).QueryRow(&total)
		return notifications, total

	} else {
		ParseQueryBuilderOrder(qb, order, "n")
		qb.Limit(limit).Offset(page * NOTIFICATION_LIMIT)

		// export raw query string from QueryBuilder object
		sql := qb.String()

		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql,  "%"+keyword+"%","%"+keyword+"%", user.Id).QueryRows(&notifications)
		return notifications, nil
	}

}

func GetAllNotificationsByUserId(userId string) []*Notification {
	o := orm.NewOrm()

	var notifications []*Notification
	querySetter := o.QueryTable("notification")
	querySetter = querySetter.Filter("deleted__isnull", true).Filter("owner_id", userId)
	querySetter.All(&notifications)
	return notifications
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
