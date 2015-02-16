package models

import (
	"time"
)

const (
	INVOICE_LIMIT int = 20
)

type Invoice struct {
	Id                  string    `orm:"pk"`
	Vendor              *Vendor   `orm:"null;rel(one)"`
	Customer            *Customer `orm:"rel(one)"`
	CustomerShipping    *Customer `orm:"rel(one)"`
	Creator             *User     `orm:"rel(one)" valid:"Entity(Creator)"`
	Updater             *User     `orm:"rel(one)" valid:"Entity(Updater)"`
	OrderNumber         int
	ReferenceNumber     int64
	Date                time.Time `orm:"auto_now_add;type(datetime)"`
	DeliveryDate        time.Time `orm:"auto_now_add;type(datetime)"`
	Currency            string
	DeliveryInstruction string
	Status              string
	SubTotal            float64
	TotalTax            float64
	Amount              float64
	Tax                 float64
	Deleted             time.Time `orm:"type(datetime)"`
	Created             time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone     int
	Updated             time.Time `orm:"auto_now_add;type(datetime)"`
	UpdatedTimeZone     int
}

func init() {
}

func AddInvoice(invoice *Invoice) string {
	o := orm.NewOrm()
	invoice.Id = uuid.New()
	_, err := o.Insert(invoice)
	if err != nil {
		panic(err)
	}
	return invoice.Id
}

func GetInvoice(uid string) (*Invoice, error) {
	invoice := Invoice{Id: uid}
	o := orm.NewOrm()
	err := o.Read(&invoice)

	return &invoice, err
}

func GetAllInvoices(status string, page int, order string, count bool, limit int) (*[]Invoice, interface{}) {
	page -= 1
	if limit < 0 {
		limit = INVOICE_LIMIT
	}
	o := orm.NewOrm()
	var invoices []Invoice
	querySetter := o.QueryTable("invoice")
	if status == "lastWeek" {
		//qs.Filter("update__gte", time.Now()).Filter("deleted__isnull", true).All(&invoices)
		querySetter = querySetter.Filter("deleted__isnull", true)
	} else if status != "all" {
		querySetter = querySetter.Filter("status", status).Filter("deleted__isnull", true)
	} else {
		querySetter.Filter("deleted__isnull", true)
	}

	if count == true {
		cnt, _ := querySetter.Count()
		return &invoices, cnt
	} else {
		querySetter = ParseQuerySetterOrder(querySetter.RelatedSel("Customer"), order)
		querySetter.Offset(page * limit).Limit(limit).All(&invoices)
		return &invoices, nil
	}
	/*
		o := orm.NewOrm()

		var invoices []*Invoice
		qs := o.QueryTable("invoice").RelatedSel("Customer")
		if status == "lastWeek"{
			//qs.Filter("update__gte", time.Now()).Filter("deleted__isnull", true).All(&invoices)
			qs.Filter("deleted__isnull", true).All(&invoices)
		}else if status != "all" {
			qs.Filter("status", status).Filter("deleted__isnull", true).All(&invoices)
		} else {
			qs.Filter("deleted__isnull", true).All(&invoices)
		}

		return invoices*/
}

func GetInvoiceByKeyword(status string, keyword string, page int, order string, count bool, limit int) (*[]Invoice, interface{}) {
	var invoices []Invoice
	qb, _ := orm.NewQueryBuilder("mysql")
	page -= 1
	if limit < 0 {
		limit = INVOICE_LIMIT
	}
	// Construct query object
	if count == false {
		qb.Select("inv.*")
	} else {
		qb.Select("count(inv.id)")
	}

	qb.From("invoice inv").
		Where("inv.name LIKE ?")

	if count == true {
		sql := qb.String()
		var total int
		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRow(&total)
		return &invoices, total

	} else {
		ParseQueryBuilderOrder(qb, order, "invoice")
		qb.Limit(limit).Offset(page * INVOICE_LIMIT)

		// export raw query string from QueryBuilder object
		sql := qb.String()

		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRows(&invoices)
		return &invoices, nil
	}

}

func UpdateInvoice(invoice *Invoice) {
	o := orm.NewOrm()
	o.Update(invoice)
}

func DeleteInvoice(invoice *Invoice) {
	o := orm.NewOrm()
	invoice.Deleted = time.Now()
	o.Update(invoice)
}

func GetMaxOrderNumber() int {
	o := orm.NewOrm()
	var total int
	qb, _ := orm.NewQueryBuilder("mysql")
	qb.Select("max(inv.order_number)").From("invoice inv")
	sql := qb.String()
	o.Raw(sql).QueryRow(&total)
	return total + 1
}

func GetInvoiceResume(status string) (amount float64, cant int) {
	type Resume struct {
		Amount float64
		Cant   int
	}
	o := orm.NewOrm()
	var result Resume
	qb, _ := orm.NewQueryBuilder("mysql")
	qb.Select("ROUND( SUM(amount) ,2 ) AS amount, count(*) AS cant").From("invoice inv").Where("deleted is null")
	if status != "all" {
		qb.And("status = ?")
		sql := qb.String()
		o.Raw(sql, status).QueryRow(&result)
	} else {
		sql := qb.String()
		o.Raw(sql).QueryRow(&result)
	}
	return result.Amount, result.Cant
}
