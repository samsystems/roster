package models

import (
	"time"
)

const PURCHASEORDERITEM_LIMIT int = 5

type PurchaseOrderItem struct {
	Id                string         `orm:"pk"`
	Creator           *User          `orm:"rel(one)" valid:"Entity(Creator)"`
	Updater           *User          `orm:"rel(one)" valid:"Entity(Updater)"`
	PurchaseOrder     *PurchaseOrder `orm:"rel(one)" valid:"Entity(PurchaseOrder)"`
	Product           *Product       `orm:"rel(one)" valid:"Entity(Product)"`
	CustomProductName string
	quantitySolicited int       `json:",string"`
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
}
