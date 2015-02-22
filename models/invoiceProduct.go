package models

import (
	"code.google.com/p/go-uuid/uuid"
	"github.com/astaxie/beego/orm"
	"time"
)

const INVOICE_PRODUCT_LIMIT int = 20

type InvoiceProduct struct {
	Id                  string    `orm:"pk"`
	Invoice             *Invoice  `orm:"rel(fk)" valid:"Entity(Invoice)"`
	Product             *Product  `orm:"rel(one)" valid:"Entity(Product)"` 
	Creator             *User     `orm:"rel(one)" valid:"Entity(Creator)"`
	Updater             *User     `orm:"rel(one)" valid:"Entity(Updater)"`
	Quantity            int       `json:",string"`
	QuantitySave        int       `orm:"-" json:",string"`
	Price               float32   `json:",string"`
	Deleted             time.Time `orm:"type(datetime)"`
	Created             time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone     int
	Updated             time.Time `orm:"auto_now_add;type(datetime)"`
	UpdatedTimeZone     int
}

func init() {
	orm.RegisterModel(new(InvoiceProduct))
}

func AddInvoiceProduct(invoiceProduct *InvoiceProduct) string {
	o := orm.NewOrm()
	invoiceProduct.Id = uuid.New()
	_, err := o.Insert(invoiceProduct)
	if err != nil {
		panic(err)
	}
	return invoiceProduct.Id
}

func UpdateInvoiceProduct(invoiceProduct *InvoiceProduct) {
	o := orm.NewOrm()
	o.Update(invoiceProduct)
}

func GetAllInvoiceProducts(uidInvoice string) ([]InvoiceProduct) {
	o := orm.NewOrm()
	var invoiceProduct []InvoiceProduct
	querySetter := o.QueryTable("invoice_product")
	querySetter.RelatedSel("Product").Filter("invoice_id", uidInvoice).All(&invoiceProduct)
	
	return invoiceProduct
	
}
