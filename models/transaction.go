package models

import (
	"code.google.com/p/go-uuid/uuid"
	"orm"
	"time"
)

const TRANSACTION_LIMIT int = 20

type Transaction struct {
	Id              string   `orm:"pk"`
	Invoice         *Invoice `orm:"rel(one)" valid:"Entity(Invoice)"`
	Product         *Product `orm:"rel(one)" valid:"Entity(Product)"`
	Creator         *User    `orm:"rel(one)" valid:"Entity(Creator)"`
	Updater         *User    `orm:"rel(one)" valid:"Entity(Updater)"`
	SubTotal        float64
	Tax             float32
	Amount          float64
	Deleted         time.Time `orm:"type(datetime)"`
	Created         time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone int
	Updated         time.Time `orm:"auto_now_add;type(datetime)"`
	UpdatedTimeZone int
}

func init() {
	orm.RegisterModel(new(Transaction))
}

func AddTransaction(transaction *Transaction) string {
	o := orm.NewOrm()
	transaction.Id = uuid.New()
	_, err := o.Insert(transaction)
	if err != nil {
		panic(err)
	}
	return transaction.Id
}

func CreateTransactionFromInvoice(invoice *Invoice) string {
	var transaction *Transaction
	transaction.Creator = invoice.Creator
	transaction.Updater = invoice.Updater
	transaction.SubTotal = invoice.SubTotal
	transaction.Amount = invoice.Amount
	transaction.Tax = invoice.Tax
	transaction.Invoice = invoice
	return AddTransaction(transaction)
}
