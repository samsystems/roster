package system

import (
	"github.com/astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"

	"appengine"
	"github.com/golang/glog"
	"strings"
)

type Application struct {
	Configuration *Configuration
}

func (application *Application) Init(filename string) {
	orm.RegisterDriver("mysql", orm.DR_MySQL)

	application.Configuration = &Configuration{}
	err := application.Configuration.Load(filename)

	if err != nil {
		glog.Fatalf("Can't read configuration file: %s", err)
		panic(err)
	}
}

func (application *Application) ConnectToDatabase() {
	var err error
	var password string

	// set default database
	if application.Configuration.Database.Password != "" {
		password = ":" + application.Configuration.Database.Password
	}

	host := application.Configuration.Database.Host
	if host == "127.0.0.1" || host == "localhost" {
		host = ""
	}

	var dsn []string
	if appengine.IsDevAppServer() {
		dsn = []string{application.Configuration.Database.User, password, "@", host, "/", application.Configuration.Database.Name}
	} else {
		dsn = []string{application.Configuration.Database.Host, "*", application.Configuration.Database.Name, application.Configuration.Database.User}
	}

	err = orm.RegisterDataBase("default", "mysql", strings.Join(dsn, ""), 30)

	if err != nil {
		glog.Fatalf("Can't connect to the database: %v", err)
		panic(err)
	}

	orm.Debug = application.Configuration.Database.Debug
	o := orm.NewOrm()
	o.Using("default")
}
