package models

import (
	"orm"
	"strings"
)

func ParseQueryBuilderOrder(qb orm.QueryBuilder, order string, entityAlias string) {
	if order != "notSorting" {
		dir := order[0]
		field := order[1:len(order)]
		if dir == '+' {
			qb.OrderBy(entityAlias + "." + field).Desc()
		} else {
			qb.OrderBy(entityAlias + "." + field).Asc()
		}
	}
}

func ParseQuerySetterOrder(qs orm.QuerySeter, order string) orm.QuerySeter {
	if order != "notSorting" {
		order = SnakeString(order)
		dir := order[0]
		field := order[1:len(order)]
		if dir == '+' {
			return qs.OrderBy(field)
		} else {
			return qs.OrderBy(order)
		}
	}
	return qs
}

func SnakeString(s string) string {
	data := make([]byte, 0, len(s)*2)
	j := false
	num := len(s)
	for i := 0; i < num; i++ {
		d := s[i]
		if i > 0 && d >= 'A' && d <= 'Z' && j {
			data = append(data, '_')
		}
		if d != '_' {
			j = true
		}
		data = append(data, d)
	}
	return strings.ToLower(string(data[:len(data)]))
}
