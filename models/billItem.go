package models

import (
	"code.google.com/p/go-uuid/uuid"
	"orm"
	"time"
)

const BILLITEM_LIMIT int = 5

type BillItem struct {
	Id                string   `orm:"pk"`
	Creator           *User    `orm:"rel(one)" valid:"Entity(Creator)"`
	Updater           *User    `orm:"rel(one)" valid:"Entity(Updater)"`
	Bill              *Bill    `orm:"rel(fk)" valid:"Entity(Bill)"`
	Product           *Product `orm:"rel(one)" valid:"Entity(Product)"`
	CustomProductName string
	Description       string
	QuantitySolicited int       `json:",string"`
	QuantityReceived  int       `json:",string"`
	DiscountPrice     float32   `json:",string"`
	Price             float32   `json:",string"`
	Deleted           time.Time `orm:"type(datetime)"`
	Created           time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone   int
	Updated           time.Time `orm:"auto_now;type(datetime)"`
	UpdatedTimeZone   int
}

func init() {
	orm.RegisterModel(new(BillItem))
}

func AddBillItem(billItem *BillItem) string {
	o := orm.NewOrm()
	billItem.Id = uuid.New()
	_, err := o.Insert(billItem)
	if err != nil {
		panic(err)
	}
	return billItem.Id
}

func UpdateBillItem(billItem *BillItem) {
	o := orm.NewOrm()
	o.Update(billItem)
}

func GetAllBillItems(uidBill string) []BillItem {
	o := orm.NewOrm()
	var billItems []BillItem
	querySetter := o.QueryTable("bill_item")
	querySetter.RelatedSel("Product").Filter("deleted__isnull", true).Filter("bill_id", uidBill).All(&billItems)

	return billItems

}

func GetAllBillItemsToDelete(uid string, idsBillItem []string) []BillItem {
	o := orm.NewOrm()
	var billItems []BillItem
	querySetter := o.QueryTable("bill_item")
	querySetter.Filter("bill_id", uid).Filter("deleted__isnull", true).Exclude("id__in", idsBillItem).All(&billItems)

	return billItems

}

func DeleteBillItem(billItem *BillItem) {
	o := orm.NewOrm()
	billItem.Deleted = time.Now()
	o.Update(billItem)
}
