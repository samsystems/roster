package models

import (
	"orm"
	"time"
)

const CITY_LIMIT int = 20

type City struct {
	Id              string   `orm:"pk"`
	Country         *Country `orm:"rel(fk)"`
	Name            string
	AccentName      string
	Region          int
	Latitude        float32
	Longitude       float32
	Deleted         bool
	Created         time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone int
	Updated         time.Time `orm:"auto_now_add;type(datetime)"`
	UpdatedTimeZone int
}

func init() {
	orm.RegisterModel(new(City))
}
