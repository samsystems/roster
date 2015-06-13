package models

import (
	"code.google.com/p/go-uuid/uuid"
	"github.com/astaxie/beego/orm"
	"time"
)

const LOCATION_LIMIT int = 10

type Location struct {
	Id              string      `orm:"pk"`
	Name            string
	Description     string
	Address         string
	Address1        string
	City            string
	Zipcode         string
	State           *State      `orm:"rel(one)" valid:"Entity(State)"`
	Country         *Country    `orm:"rel(one)" valid:"Entity(Country)"`
	Company         *Company    `orm:"null;rel(one); valid:"Entity(Company)"`
	Creator         *User       `orm:"rel(one)" valid:"Entity(Creator)"`
	Updater         *User       `orm:"rel(one)" valid:"Entity(Updater)"`
	Deleted         time.Time   `orm:"type(datetime)"`
	Created         time.Time   `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone int
	Updated         time.Time   `orm:"auto_now;type(datetime)"`
	UpdatedTimeZone int
}

func init() {
	orm.RegisterModel(new(Location))
}

func AddLocation(g *Location) string {
	o := orm.NewOrm()
	g.Id = uuid.New()
	_, err := o.Insert(g)
	if err != nil {
		panic(err)
	}
	return g.Id
}

func GetLocation(uid string) (*Location, error) {
	g := Location{Id: uid}
	o := orm.NewOrm()
	err := o.Read(&g)
	if g.Country != nil {
		o.Read(g.Country)
	}
	return &g, err
}

func GetAllLocations(page int, order string, count bool, limit int) ([]Location, interface{}) {
	page -= 1
	if limit < 0 {
		limit = PRODUCT_LIMIT
	}
	o := orm.NewOrm()
	var locations []Location
	querySetter := o.QueryTable("location")
	querySetter = querySetter.Filter("deleted__isnull", true)
	if count == true {
		cnt, _ := querySetter.Count()
		return locations, cnt
	} else {
		querySetter = ParseQuerySetterOrder(querySetter, order)
		querySetter.Offset(page * limit).Limit(limit).All(&locations)
		return locations, nil
	}
}

func GetLocationByKeyword(keyword string, page int, order string, count bool, limit int) ([]Location, interface{}) {
	var locations []Location
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

	qb.From("location p").
		Where("p.name LIKE ?")

	if count == true {
		sql := qb.String()
		var total int
		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRow(&total)
		return locations, total

	} else {
		ParseQueryBuilderOrder(qb, order, "p")
		qb.Limit(limit).Offset(page * LOCATION_LIMIT)

		// export raw query string from QueryBuilder object
		sql := qb.String()

		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%").QueryRows(&locations)
		return locations, nil
	}

}

func UpdateLocation(g *Location) {
	o := orm.NewOrm()
	o.Update(g)
}

func DeleteLocation(g *Location) {
	o := orm.NewOrm()
	g.Deleted = time.Now()
	o.Update(g)
}

func LocationToString(location *Location) (string) {
	var ShippingLocation string;
	o := orm.NewOrm()
	if location != nil {
		ShippingLocation =	location.Address
		if location.Address1 != ""{
			ShippingLocation +=  ", "+ location.Address1
		}
		if location.State != nil {
			o.Read(location.State)
			ShippingLocation += ", "+location.State.Name
		}
		
		if location.Country != nil {
			o.Read(location.Country)
			ShippingLocation +=  ", "+ location.Country.Name
		}
	}
	return ShippingLocation
}