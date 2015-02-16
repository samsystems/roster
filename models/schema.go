package models

import (
	"fmt"
	"github.com/astaxie/beego/orm"
)

func UpdateSchema() string {
	name := "default"

	// Drop table and re-create.
	force := false

	// Print log.
	verbose := true

	// Error.
	err := orm.RunSyncdb(name, force, verbose)
	if err != nil {
		return "some erros"
	}
	return "done"
}

func CreateSchema() string {
	name := "default"

	// Drop table and re-create.
	force := true

	// Print log.
	verbose := true

	// Error.
	err := orm.RunSyncdb(name, force, verbose)
	if err != nil {
		fmt.Println(err)
		return "some errors"
	}
	return "done"
}
