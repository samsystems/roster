package models

import (
	"code.google.com/p/go-uuid/uuid"
	"github.com/astaxie/beego/orm"
	"time"
)

const PRODUCT_LIMIT int = 10

type Product struct {
	Id              string `orm:"pk"`
	Creator         *User  `orm:"rel(one)" valid:"Entity(Creator)"`
	Updater         *User  `orm:"rel(one)" valid:"Entity(Updater)"`
	Name            string
	Description     string
	Manufacturer    string
	Status          int
	Stock           int     `json:",string"`
	Price           float32 `json:",string"`
	Size            string
	Sku             string
	Serial          string
	Deleted         time.Time `orm:"type(datetime)"`
	Created         time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone int
	Updated         time.Time `orm:"auto_now_add;type(datetime)"`
	UpdatedTimeZone int
}

func init() {
	orm.RegisterModel(new(Product))
}

func AddProduct(g *Product) string {
	o := orm.NewOrm()
	g.Id = uuid.New()
	_, err := o.Insert(g)
	if err != nil {
		panic(err)
	}
	return g.Id
}

func GetProduct(uid string) (*Product, error) {
	g := Product{Id: uid}
	o := orm.NewOrm()
	err := o.Read(&g)

	return &g, err
}

func GetAllProducts(page int, order string, count bool, limit int) ([]Product, interface{}) {
	page -= 1
	if limit < 0 {
		limit = PRODUCT_LIMIT
	}
	o := orm.NewOrm()
	var products []Product
	querySetter := o.QueryTable("product")
	querySetter = querySetter.Filter("deleted__isnull", true)
	if count == true {
		cnt, _ := querySetter.Count()
		return products, cnt
	} else {
		querySetter = ParseQuerySetterOrder(querySetter, order)
		querySetter.Offset(page * limit).Limit(limit).All(&products)
		return products, nil
	}
}

func GetProductByKeyword(keyword string, page int, order string, count bool, limit int) ([]Product, interface{}) {
	var products []Product
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

	qb.From("product p").
		Where("p.name LIKE ?")

	if count == true {
		sql := qb.String()
		var total int
		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRow(&total)
		return products, total

	} else {
		ParseQueryBuilderOrder(qb, order, "p")
		qb.Limit(limit).Offset(page * PRODUCT_LIMIT)

		// export raw query string from QueryBuilder object
		sql := qb.String()

		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRows(&products)
		return products, nil
	}

}

func UpdateProduct(g *Product) {
	o := orm.NewOrm()
	o.Update(g)
}

func DeleteProduct(g *Product) {
	o := orm.NewOrm()
	g.Deleted = time.Now()
	o.Update(g)
}
