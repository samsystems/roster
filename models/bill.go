package models

import (
	"code.google.com/p/go-uuid/uuid"
	"orm"
	"time"
)

const (
	BILL_LIMIT int    = 5
	BILL_ALL   string = "all"
	BILL_DRAFT string = "draft"
)

type Bill struct {
	Id                  string    `orm:"pk"`
	Creator             *User     `orm:"rel(one)" valid:"Entity(Creator)"`
	Updater             *User     `orm:"rel(one)" valid:"Entity(Updater)"`
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
	Status              string
	SubTotal            float32 `json:",string"`
	TotalTax            float32
	Amount              float32 `json:",string"`
	Tax                 float32
	Company             *Company    `orm:"rel(one)" valid:"Entity(Company)"`
	BillItems           []*BillItem `orm:"reverse(many)"`
	Deleted             time.Time   `orm:"type(datetime)"`
	Created             time.Time   `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone     int
	Updated             time.Time `orm:"auto_now;type(datetime)"`
	UpdatedTimeZone     int
}

func init() {
	orm.RegisterModel(new(Bill))
}

func GetBill(uid string) (*Bill, error) {
	c := Bill{Id: uid}
	o := orm.NewOrm()
	err := o.Read(&c)

	return &c, err
}

func GetAllBill(status string, page int, order string, count bool, limit int) (*[]Bill, interface{}) {
	page -= 1
	if limit < 0 {
		limit = BILL_LIMIT
	}
	o := orm.NewOrm()
	var bills []Bill
	querySetter := o.QueryTable("bill")
	querySetter = querySetter.Filter("deleted__isnull", true)

	if status != BILL_ALL {
		querySetter = querySetter.Filter("status", status).Filter("deleted__isnull", true)
	} else {
		querySetter = querySetter.Filter("deleted__isnull", true)
	}

	if count == true {
		cnt, _ := querySetter.Count()
		return &bills, cnt
	} else {
		querySetter = ParseQuerySetterOrder(querySetter, order)

		querySetter.Offset(page * limit).Limit(limit).All(&bills)
		return &bills, nil
	}
}

func GetBillByKeyword(keyword string, page int, order string, count bool, limit int) (*[]Bill, interface{}) {
	var bills []Bill
	qb, _ := orm.NewQueryBuilder("mysql")
	page -= 1
	if limit < 0 {
		limit = BILL_LIMIT
	}
	// Construct query object
	if count == false {
		qb.Select("c.*")
	} else {
		qb.Select("count(c.id)")
	}

	qb.From("bill c").
		LeftJoin("country p").On("c.country_id = p.iso").
		LeftJoin("state s").On("c.state_id = s.id").
		Where("c.name LIKE ?")

	if count == true {
		sql := qb.String()
		var total int
		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRow(&total)
		return &bills, total

	} else {
		ParseQueryBuilderOrder(qb, order, "e")
		qb.Limit(limit).Offset(page * BILL_LIMIT)

		// export raw query string from QueryBuilder object
		sql := qb.String()

		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRows(&bills)
		return &bills, nil
	}

}

func AddBill(c *Bill) string {
	o := orm.NewOrm()
	c.Id = uuid.New()
	_, err := o.Insert(c)
	if err != nil {
		panic(err)
	}
	return c.Id
}

func UpdateBill(c *Bill) {
	o := orm.NewOrm()
	o.Update(c)
}

func DeleteBill(c *Bill) {
	o := orm.NewOrm()
	c.Deleted = time.Now()
	o.Update(c)
}

func GetBillResume(status string) (amount float64, cant int) {
	type Resume struct {
		Amount float64
		Cant   int
	}
	o := orm.NewOrm()
	var result Resume
	qb, _ := orm.NewQueryBuilder("mysql")
	qb.Select("ROUND( SUM(amount) ,2 ) AS amount, count(*) AS cant").From("bill b").Where("deleted is null")
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

func GetBillMaxOrderNumber() int {
	o := orm.NewOrm()
	var total int
	qb, _ := orm.NewQueryBuilder("mysql")
	qb.Select("max(b.order_number)").From("bill b")
	sql := qb.String()

	err := o.Raw(sql).QueryRow(&total)
	if err != nil {
		panic(err)
	}
	return total + 1
}
