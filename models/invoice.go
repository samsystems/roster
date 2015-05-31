package models

import (
	"code.google.com/p/go-uuid/uuid"
	"github.com/astaxie/beego/orm"
	"time"
)

const INVOICE_LIMIT int = 20

type Invoice struct {
	Id                  string    `orm:"pk"`
	Vendor              *Vendor   `orm:"null;rel(one)"`
	Customer            *Customer `orm:"rel(one)" valid:"Entity(Creator)"`
	Emails              string
	BillingLocation     *Location `orm:"rel(one)"`
	ShippingLocation    *Location `orm:"rel(one)"`
	Creator             *User     `orm:"rel(one)" valid:"Entity(Creator)"`
	Updater             *User     `orm:"rel(one)" valid:"Entity(Updater)"`
	OrderNumber         int
	ReferenceNumber     int32     `json:"ReferenceNumber,string"`
	Date                time.Time `orm:"type(datetime)" json:"Date"`
	DueDate        time.Time `orm:"type(datetime)" json:"DueDate"`
	Currency            string
	DeliveryInstruction string
	Status              string
	Type                string            //invoice or estimate
	SubTotal            float64
	TotalTax            float64
	Amount              float64
	Tax                 float32
	Company             *Company  `orm:"rel(one)" valid:"Entity(Company)"`
	InvoiceProducts     []*InvoiceProduct `orm:"reverse(many)"`
	Deleted             time.Time         `orm:"type(datetime)"`
	Created             time.Time         `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone     int
	Updated             time.Time `orm:"auto_now;type(datetime)"`
	UpdatedTimeZone     int
}

func init() {
	orm.RegisterModel(new(Invoice))
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
	if invoice.Customer != nil {
		o.Read(invoice.Customer)
	}
	if invoice.BillingLocation != nil {
		o.Read(invoice.BillingLocation)
		if invoice.BillingLocation.State != nil {
			o.Read(invoice.BillingLocation.State)
		}
	}
	if invoice.ShippingLocation != nil {
		o.Read(invoice.ShippingLocation)
		if invoice.ShippingLocation.State != nil {
			o.Read(invoice.ShippingLocation.State)
		}
	}
	return &invoice, err
}

func GetAllInvoices(status string,company *Company, page int, order string, count bool, limit int) ([]Invoice, interface{}) {
	page -= 1
	if limit < 0 {
		limit = INVOICE_LIMIT
	}
	o := orm.NewOrm()
	var invoices []Invoice
	querySetter := o.QueryTable("invoice")
	if status == "lastWeek" {
		//qs.Filter("update__gte", time.Now()).Filter("deleted__isnull", true).All(&invoices)
		querySetter = querySetter.Filter("company", company).Filter("deleted__isnull", true)
	} else if status != "all" {
		querySetter = querySetter.Filter("company", company).Filter("status", status).Filter("deleted__isnull", true)
	} else {
		querySetter = querySetter.Filter("company", company).Filter("deleted__isnull", true)
	}

	if count == true {
		cnt, _ := querySetter.Count()
		return invoices, cnt
	} else {
		querySetter = ParseQuerySetterOrder(querySetter.RelatedSel("Customer"), order)
		querySetter.Offset(page * limit).Limit(limit).All(&invoices)
		return invoices, nil
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

func GetInvoiceByKeyword(status string, company *Company,keyword string, page int, order string, count bool, limit int) ([]Invoice, interface{}) {
	page -= 1
	if limit < 0 {
		limit = INVOICE_LIMIT
	}
	o := orm.NewOrm()
	if count == true {
		qb, _ := orm.NewQueryBuilder("mysql")
		qb.Select("count(inv.id)")
		qb.From("invoice inv").LeftJoin("customer c").On("inv.customer_id = c.id").Where("inv.reference_number LIKE ? or inv.order_number LIKE ? or c.name LIKE ?").And("inv.deleted is null").And("inv.company_id = ?")
		// execute the raw query string
		
		var total int
		if status != "all" {
			qb.And("status = ?")
			sql := qb.String()
			o.Raw(sql, "%"+keyword+"%","%"+keyword+"%","%"+keyword+"%", status, company.Id).QueryRow(&total)
			return nil, total
		} else {
			sql := qb.String()
			o.Raw(sql, "%"+keyword+"%","%"+keyword+"%","%"+keyword+"%", company.Id).QueryRow(&total)
			return nil, total
		}

	} else {
		var invoices []Invoice
		querySetter := o.QueryTable("invoice")
		if status != "all" {
			//querySetter = querySetter.Filter("status", status).Filter("deleted__isnull", true).Filter("reference_number__icontains", keyword)
			cond := orm.NewCondition()
			cond1 := cond.And("status", status).And("deleted__isnull", true)
			cond2 := cond.AndCond(cond1).AndCond(cond.Or("reference_number__icontains", keyword).Or("order_number__icontains", keyword).Or("Customer__name__icontains",keyword))
			
			querySetter = ParseQuerySetterOrder(querySetter.RelatedSel("Customer").SetCond(cond2), order)
			querySetter.Offset(page * limit).Limit(limit).All(&invoices)
			return invoices, nil
		} else {
			//querySetter = querySetter.Filter("deleted__isnull", true).Filter("reference_number__icontains", keyword)
			cond := orm.NewCondition()
			cond1 := cond.And("deleted__isnull", true)
			cond2 := cond.AndCond(cond1).AndCond(cond.Or("reference_number__icontains", keyword).Or("order_number__icontains", keyword).Or("Customer__name__icontains",keyword))
			//querySetter.SetCond(cond2)
			
			querySetter = ParseQuerySetterOrder(querySetter.RelatedSel("Customer").SetCond(cond2), order)
			querySetter.Offset(page * limit).Limit(limit).All(&invoices)
			return invoices, nil
		}
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
	/*if invoice.Status == "draft" {
		invoiceProducts := GetAllInvoiceProducts(invoice.Id)
		for _, v := range invoiceProducts {
			product := v.Product
			//product.Stock =product.Stock+v.Quantity //to change now a product have a variation
			o.Update(product)
		}
	}*/
}

func GetMaxOrderNumber(typeData string) int {
	o := orm.NewOrm()
	var total int
	qb, _ := orm.NewQueryBuilder("mysql")
	qb.Select("max(inv.order_number)").From("invoice inv").Where("inv.type = ?")
	sql := qb.String()
	
	err:=o.Raw(sql, typeData).QueryRow(&total)
	if err != nil {
		panic(err)
	}
	return total + 1
}

func GetInvoiceResume(status string,company *Company) (amount float64, cant int) {
	type Resume struct {
		Amount float64
		Cant   int
	}
	o := orm.NewOrm()
	var result Resume
	qb, _ := orm.NewQueryBuilder("mysql")
	qb.Select("ROUND( SUM(amount) ,2 ) AS amount, count(*) AS cant").From("invoice inv").Where("inv.deleted is null").And("inv.company_id = ?")
	if status != "all" {
		qb.And("status = ?")
		sql := qb.String()
		o.Raw(sql,company.Id,status).QueryRow(&result)
	} else {
		sql := qb.String()
		o.Raw(sql,company.Id).QueryRow(&result)
	}
	return result.Amount, result.Cant
}
