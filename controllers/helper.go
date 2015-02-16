package controllers

import (
	"strconv"
)

// @Description Parse Query Params
// @Param url.Values values of url

func ParseParamsOfGetRequest(params map[string]string) (int, string, string) {
	page := 1
	if pageP, ok := params["page"]; ok {
		page, _ = strconv.Atoi(pageP)
	}
	sort := "notSorting"
	if sortP, ok := params["sort"]; ok {
		sort = sortP
	}
	keyword := ""
	if keywordP, ok := params["keyword"]; ok {
		keyword = keywordP
	}
	return page, sort, keyword
}
