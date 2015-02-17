package ui

import (
	"github.com/sam/roster/controllers"

	"github.com/gorilla/mux"
	"net/http"
)

func init() {

	router := mux.NewRouter()

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

	http.Handle("/", router)
}
