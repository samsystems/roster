package models

import (
	"code.google.com/p/go-uuid/uuid"
	"orm"
	"time"
)

const PURCHASEORDERITEM_LIMIT int = 5

type PurchaseOrderItem struct {
	Id                string         `orm:"pk"`
	Creator           *User          `orm:"rel(one)" valid:"Entity(Creator)"`
	Updater           *User          `orm:"rel(one)" valid:"Entity(Updater)"`
	PurchaseOrder     *PurchaseOrder `orm:"rel(fk)" valid:"Entity(PurchaseOrder)"`
	Product           *Product       `orm:"rel(one)" valid:"Entity(Product)"`
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
	orm.RegisterModel(new(PurchaseOrderItem))
}

func AddPurchaseOrderItem(purchaseOrderItem *PurchaseOrderItem) string {
	o := orm.NewOrm()
	purchaseOrderItem.Id = uuid.New()
	_, err := o.Insert(purchaseOrderItem)
	if err != nil {
		panic(err)
	}
	return purchaseOrderItem.Id
}

func UpdatePurchaseOrderItem(purchaseOrderItem *PurchaseOrderItem) {
	o := orm.NewOrm()
	o.Update(purchaseOrderItem)
}

func GetAllPurchaseOrderItems(uidPurchase string) []PurchaseOrderItem {
	o := orm.NewOrm()
	var purchaseOrderItems []PurchaseOrderItem
	querySetter := o.QueryTable("purchase_order_item")
	querySetter.RelatedSel("Product").Filter("deleted__isnull", true).Filter("purchase_order_id", uidPurchase).All(&purchaseOrderItems)

	return purchaseOrderItems

}

func GetAllPurchaseOrderItemsToDelete(uid string, idsPurchaseOrderItem []string) []PurchaseOrderItem {
	o := orm.NewOrm()
	var purchaseOrderItems []PurchaseOrderItem
	querySetter := o.QueryTable("purchase_order_item")
	querySetter.Filter("purchase_order_id", uid).Filter("deleted__isnull", true).Exclude("id__in", idsPurchaseOrderItem).All(&purchaseOrderItems)

	return purchaseOrderItems

}

func DeletePurchaseOrderItem(purchaseOrderItem *PurchaseOrderItem) {
	o := orm.NewOrm()
	purchaseOrderItem.Deleted = time.Now()
	o.Update(purchaseOrderItem)
}
