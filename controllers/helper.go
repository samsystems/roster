package controllers

import (
	"net/url"
	"strconv"
)

// @Description Parse Query Params
// @Param url.Values values of url

func ParseParamsOfGetRequest(params map[string]string) (int, string, string) {
	page := 1
	if pageP, ok := params["page"]; ok {
		page, _ = strconv.Atoi(pageP[0])
	}
	sort := "notSorting"
	if sortP, ok := params["sort"]; ok {
		sort = sortP[0]
	}
	keyword := ""
	if keywordP, ok := params["keyword"]; ok {
		keyword = keywordP[0]
	}
	return page, sort, keyword
}
