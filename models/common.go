package models

import (
	"orm"
)

func IsUnique(key, property, value, idValue string) bool {
	o := orm.NewOrm()
	qs := o.QueryTable(key)
	qs = qs.Filter(property, value).Exclude("id", idValue)
	cnt, _ := qs.Count()
	if cnt == 0 {
		return true
	}
	return false

}
