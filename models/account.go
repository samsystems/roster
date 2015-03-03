package models

import (
	"code.google.com/p/go-uuid/uuid"
	"github.com/astaxie/beego/orm"
	"time"
)

const ACCOUNT_LIMIT int = 10

type Account struct {
	Id              string `orm:"pk"`
	Name            string
	Creator         *User     `orm:"rel(one)" valid:"Entity(Creator)"`
	Updater         *User     `orm:"rel(one)" valid:"Entity(Updater)"`
	Deleted         time.Time `orm:"type(datetime)"`
	Created         time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone int
	Updated         time.Time `orm:"auto_now;type(datetime)"`
	UpdatedTimeZone int
}

func init() {
	orm.RegisterModel(new(Account))
}

func AddAccount(g *Account) string {
	o := orm.NewOrm()
	g.Id = uuid.New()
	_, err := o.Insert(g)
	if err != nil {
		panic(err)
	}
	return g.Id
}

func GetAccount(uid string) (*Account, error) {
	g := Account{Id: uid}
	o := orm.NewOrm()
	err := o.Read(&g)

	return &g, err
}

func GetAllAccounts(page int, order string, count bool, limit int) ([]Account, interface{}) {
	page -= 1
	if limit < 0 {
		limit = PRODUCT_LIMIT
	}
	o := orm.NewOrm()
	var accounts []Account
	querySetter := o.QueryTable("account")
	querySetter = querySetter.Filter("deleted__isnull", true)
	if count == true {
		cnt, _ := querySetter.Count()
		return accounts, cnt
	} else {
		querySetter = ParseQuerySetterOrder(querySetter, order)
		querySetter.Offset(page * limit).Limit(limit).All(&accounts)
		return accounts, nil
	}
}

func GetAccountByKeyword(keyword string, page int, order string, count bool, limit int) ([]Account, interface{}) {
	var accounts []Account
	qb, _ := orm.NewQueryBuilder("mysql")
	page -= 1
	if limit < 0 {
		limit = PRODUCT_LIMIT
	}
	// Construct query object
	if count == false {
		qb.Select("p.*")
	} else {
		qb.Select("count(p.id)")
	}

	qb.From("account p").
		Where("p.name LIKE ?")

	if count == true {
		sql := qb.String()
		var total int
		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRow(&total)
		return accounts, total

	} else {
		ParseQueryBuilderOrder(qb, order, "p")
		qb.Limit(limit).Offset(page * ACCOUNT_LIMIT)

		// export raw query string from QueryBuilder object
		sql := qb.String()

		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRows(&accounts)
		return accounts, nil
	}

}

func UpdateAccount(g *Account) {
	o := orm.NewOrm()
	o.Update(g)
}

func DeleteAccount(g *Account) {
	o := orm.NewOrm()
	g.Deleted = time.Now()
	o.Update(g)
}
