package main

import (
	"github.com/gorilla/mux"
	"net/http"

	"appengine"

	"controllers"
	"system"
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

	router := mux.NewRouter()
	RegisterHandlers(router)
	http.Handle("/", router)
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

	//	documentController := controllers.DocumentController{}
	//	documentController.RegisterHandlers(router)

	industryController := controllers.IndustryController{}
	industryController.RegisterHandlers(router)

	locationController := controllers.LocationController{}
	locationController.RegisterHandlers(router)

	accountController := controllers.AccountController{}
	accountController.RegisterHandlers(router)

	productVariationController := controllers.ProductVariationController{}
	productVariationController.RegisterHandlers(router)
}
