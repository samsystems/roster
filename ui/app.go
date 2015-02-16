package ui

import (
	"github.com/sam/roster/controllers"

	"github.com/gorilla/mux"
	"net/http"
)

func init() {

	router := mux.NewRouter()

	controllers.CompanyController.RegisterHandlers(router)
	controllers.ContactController.RegisterHandlers(router)
	controllers.CountryController.RegisterHandlers(router)
	controllers.CustomerController.RegisterHandlers(router)
	controllers.GroupController.RegisterHandlers(router)
	controllers.InvoiceController.RegisterHandlers(router)
	controllers.MagentoAccountController.RegisterHandlers(router)
	controllers.NotificationController.RegisterHandlers(router)
	controllers.ProductController.RegisterHandlers(router)
	controllers.PurchaseOrderController.RegisterHandlers(router)
	controllers.StateController.RegisterHandlers(router)
	controllers.UserController.RegisterHandlers(router)
	controllers.VendorController.RegisterHandlers(router)

	http.Handle("/", r)
}
