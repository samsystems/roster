package models

import (
	"code.google.com/p/go-uuid/uuid"
	"github.com/astaxie/beego/orm"
	"time"
)

const PRODUCT_VARIATION_LIMIT int = 10

type ProductVariation struct {
	Id              string   `orm:"pk"`
	Product         *Product `orm:"rel(one)" valid:"Entity(Product)"`
	Variation       string
	Alert           bool
	AlertAt         int `json:",string"`
	Stock           int `json:",string"`
	Sku             string
	Serial          string
	Location        *Location `orm:"null;rel(one)"`
	Creator         *User     `orm:"rel(one)" valid:"Entity(Creator)"`
	Updater         *User     `orm:"rel(one)" valid:"Entity(Updater)"`
	Deleted         time.Time `orm:"type(datetime)"`
	Created         time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone int
	Updated         time.Time `orm:"auto_now;type(datetime)"`
	UpdatedTimeZone int
}

func init() {
	orm.RegisterModel(new(ProductVariation))
}

func AddProductVariation(g *ProductVariation) string {
	o := orm.NewOrm()
	g.Id = uuid.New()
	_, err := o.Insert(g)
	if err != nil {
		panic(err)
	}
	return g.Id
}

func GetProductVariation(uid string) (*ProductVariation, error) {
	g := ProductVariation{Id: uid}
	o := orm.NewOrm()
	err := o.Read(&g)

	return &g, err
}

func GetAllProductVariations(page int, order string, count bool, limit int) ([]ProductVariation, interface{}) {
	page -= 1
	if limit < 0 {
		limit = PRODUCT_LIMIT
	}
	o := orm.NewOrm()
	var productVariations []ProductVariation
	querySetter := o.QueryTable("product_variation")
	querySetter = querySetter.Filter("deleted__isnull", true)
	if count == true {
		cnt, _ := querySetter.Count()
		return productVariations, cnt
	} else {
		querySetter = ParseQuerySetterOrder(querySetter, order)
		querySetter.Offset(page * limit).Limit(limit).All(&productVariations)
		return productVariations, nil
	}
}

func GetAllProductVariationsByProduct(uidProduct string) ([]ProductVariation, interface{}) {

	o := orm.NewOrm()
	var productVariations []ProductVariation
	querySetter := o.QueryTable("product_variation")
	querySetter = querySetter.Filter("deleted__isnull", true).Filter("product_id", uidProduct)
	querySetter.All(&productVariations)
	return productVariations, nil
}

func GetProductVariationByKeyword(keyword string, page int, order string, count bool, limit int) ([]ProductVariation, interface{}) {
	var productVariations []ProductVariation
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

	qb.From("product_variation p").
		Where("p.name LIKE ?")

	if count == true {
		sql := qb.String()
		var total int
		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRow(&total)
		return productVariations, total

	} else {
		ParseQueryBuilderOrder(qb, order, "p")
		qb.Limit(limit).Offset(page * PRODUCT_VARIATION_LIMIT)

		// export raw query string from QueryBuilder object
		sql := qb.String()

		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRows(&productVariations)
		return productVariations, nil
	}

}

func UpdateProductVariation(g *ProductVariation) {
	o := orm.NewOrm()
	o.Update(g)
}

func DeleteProductVariation(g *ProductVariation) {
	o := orm.NewOrm()
	g.Deleted = time.Now()
	o.Update(g)
}
