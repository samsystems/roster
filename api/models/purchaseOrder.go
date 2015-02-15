package models

import (
	"github.com/astaxie/beego/orm"
	"github.com/sam/inventory-api/go-uuid/uuid"
	"log"
	"time"
)

const (
	PURCHASE_LIMIT             int = 5
	PURCHASE_ALL               int = 0
	PURCHASE_DRAFT_LIMIT       int = 1
	PURCHASE_AWAITING_APPROVAL int = 2
	PURCHASE_APPROVED          int = 3
	PURCHASE_BILLED            int = 4
)

type PurchaseOrder struct {
	Id                  string    `orm:"pk"`
	Creator             *User     `orm:"rel(one)" valid:"Entity(Creator)"`
	Updater             *User     `orm:"rel(one)" valid:"Entity(Updater)"`
	Supplier            *User     `orm:"rel(one)" valid:"Entity(Supplier)"`
	OrderNumber         int       `json:",string"`
	Reference           int       `json:",string"`
	Date                time.Time `orm:"type(datetime)"`
	ExpectedArrival     time.Time `orm:"type(datetime)"`
	DateRaised          time.Time `orm:"type(datetime)"`
	Sent                bool
	Currency            string
	DeliveryInstruction string
	DeliveryAddress     string
	DeliveryAttention   string
	DeliveryPhone       string
	Status              int       `json:",string"`
	SubTotal            float32   `json:",string"`
	TotalTax            float32   `json:",string"`
	Amount              float32   `json:",string"`
	Tax                 float32   `json:",string"`
	Deleted             time.Time `orm:"type(datetime)"`
	Created             time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone     int
	Updated             time.Time `orm:"auto_now;type(datetime)"`
	UpdatedTimeZone     int
}

func init() {
	orm.RegisterModel(new(PurchaseOrder))
}

func GetPurchaseOrder(uid string) (*PurchaseOrder, error) {
	c := PurchaseOrder{Id: uid}
	o := orm.NewOrm()
	err := o.Read(&c)
	return &c, err
}

func GetAllPurchaseOrder(status int, page int, order string, count bool, limit int) (*[]PurchaseOrder, interface{}) {
	page -= 1
	if limit < 0 {
		limit = COMPANY_LIMIT
	}
	o := orm.NewOrm()
	var companies []PurchaseOrder
	querySetter := o.QueryTable("purchase_order")
	querySetter = querySetter.Filter("deleted__isnull", true)

	if status != PURCHASE_ALL {
		log.Print(status)
		querySetter = querySetter.Filter("status", status).Filter("deleted__isnull", true)
	} else {
		querySetter = querySetter.Filter("deleted__isnull", true)
	}

	if count == true {
		cnt, _ := querySetter.Count()
		return &companies, cnt
	} else {
		querySetter = ParseQuerySetterOrder(querySetter, order)
		querySetter.Offset(page * limit).Limit(limit).All(&companies)
		return &companies, nil
	}
}

func GetPurchaseOrderByKeyword(keyword string, page int, order string, count bool, limit int) (*[]PurchaseOrder, interface{}) {
	var companies []PurchaseOrder
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

	qb.From("purchase_order c").
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
		ParseQueryBuilderOrder(qb, order, "e")
		qb.Limit(limit).Offset(page * COMPANY_LIMIT)

		// export raw query string from QueryBuilder object
		sql := qb.String()

		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRows(&companies)
		return &companies, nil
	}

}

func AddPurchaseOrder(c *PurchaseOrder) string {
	o := orm.NewOrm()
	c.Id = uuid.New()
	_, err := o.Insert(c)
	if err != nil {
		panic(err)
	}
	return c.Id
}

func UpdatePurchaseOrder(c *PurchaseOrder) {
	o := orm.NewOrm()
	o.Update(c)
}

func DeletePurchaseOrder(c *PurchaseOrder) {
	o := orm.NewOrm()
	c.Deleted = time.Now()
	o.Update(c)
}

func GetPurchaseResume(status int) (amount float64, cant int) {
	type Resume struct {
		Amount float64
		Cant   int
	}
	o := orm.NewOrm()
	var result Resume
	qb, _ := orm.NewQueryBuilder("mysql")
	qb.Select("ROUND( SUM(amount) ,2 ) AS amount, count(*) AS cant").From("purchase_order pur").Where("deleted is null")
	if status != PURCHASE_ALL {
		qb.And("status = ?")
		sql := qb.String()
		o.Raw(sql, status).QueryRow(&result)
	} else {
		sql := qb.String()
		o.Raw(sql).QueryRow(&result)
	}
	return result.Amount, result.Cant
}
