package main

import (
	_ "github.com/sam/inventory-api/docs"
	_ "github.com/sam/inventory-api/routers"

	"github.com/astaxie/beego"

	"github.com/astaxie/beego/context"
	"github.com/astaxie/beego/plugins/cors"

	"github.com/sam/inventory-api/system"
)

func main() {
	var application = &system.Application{}

	application.Init("config.json")
	application.ConnectToDatabase()

	beego.InsertFilter("*", beego.BeforeRouter, cors.Allow(&cors.Options{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "DELETE", "PUT", "PATCH"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// TODO: need to modify headers here because when I add the AllowHeaders options to the beego CORS plugin it doesn't add them correctly. Maybe a bug on the plugin?
	beego.Options("/*", func(ctx *context.Context) {
		ctx.ResponseWriter.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Range, Content-Disposition, Content-Type, Authorization, access_token")
	})

	// TODO: access token
	/*beego.InsertFilter("*", beego.BeforeRouter, func(ctx *context.Context) {
		if ctx.Request.Header.Get("access_token") != "34123k4jh123k4h123k4h12l3k4" {
			ctx.ResponseWriter.WriteHeader(401)
			ctx.ResponseWriter.Write([]byte("401 Unauthorized\n"))
			return
		}
	})*/

	if beego.RunMode == "dev" {
		beego.DirectoryIndex = true
		beego.StaticDir["/swagger"] = "swagger"
	}

	beego.Run()
}
