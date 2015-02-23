package main

import (
	"github.com/gorilla/mux"

	"appengine"

	"github.com/samsystems/roster/controllers"
	"github.com/samsystems/roster/system"
)

var router = new(mux.Router)

func init() {
	var application = &system.Application{}

	if appengine.IsDevAppServer() {
		application.Init("config.json")
	} else {
		application.Init("config.appengine.json")
	}
	application.ConnectToDatabase()
}

func RegisterHandlers(r *mux.Router) {
	router = r

	companyController := controllers.CompanyController{}
	companyController.RegisterHandlers(router)

	contactController := controllers.ContactController{}
	contactController.RegisterHandlers(router)

	countryController := controllers.CountryController{}
	countryController.RegisterHandlers(router)

	customerController := controllers.CustomerController{}
	customerController.RegisterHandlers(router)

	groupController := controllers.GroupController{}
	groupController.RegisterHandlers(router)

	invoiceController := controllers.InvoiceController{}
	invoiceController.RegisterHandlers(router)

	magentoAccountController := controllers.MagentoAccountController{}
	magentoAccountController.RegisterHandlers(router)

	notificationController := controllers.NotificationController{}
	notificationController.RegisterHandlers(router)

	productController := controllers.ProductController{}
	productController.RegisterHandlers(router)

	purchaseOrderController := controllers.PurchaseOrderController{}
	purchaseOrderController.RegisterHandlers(router)

	stateController := controllers.StateController{}
	stateController.RegisterHandlers(router)

	userController := controllers.UserController{}
	userController.RegisterHandlers(router)

	vendorController := controllers.VendorController{}
	vendorController.RegisterHandlers(router)
}
