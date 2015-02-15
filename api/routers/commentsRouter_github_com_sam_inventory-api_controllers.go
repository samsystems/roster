package routers

import (
	"github.com/astaxie/beego"
)

func init() {
	
	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:InvoiceController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:InvoiceController"],
		beego.ControllerComments{
			"GetAll",
			`/`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:InvoiceController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:InvoiceController"],
		beego.ControllerComments{
			"Get",
			`/:uid`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:InvoiceController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:InvoiceController"],
		beego.ControllerComments{
			"GetCountAll",
			`/count`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:InvoiceController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:InvoiceController"],
		beego.ControllerComments{
			"GetMaxOrderNumber",
			`/max-ordernumber`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:InvoiceController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:InvoiceController"],
		beego.ControllerComments{
			"GetInvoiceResume",
			`/resume/:status`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:InvoiceController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:InvoiceController"],
		beego.ControllerComments{
			"Put",
			`/:uid`,
			[]string{"put"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:InvoiceController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:InvoiceController"],
		beego.ControllerComments{
			"Delete",
			`/:uid`,
			[]string{"delete"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:InvoiceController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:InvoiceController"],
		beego.ControllerComments{
			"Post",
			`/`,
			[]string{"post"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:GroupController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:GroupController"],
		beego.ControllerComments{
			"Get",
			`/:uid`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:GroupController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:GroupController"],
		beego.ControllerComments{
			"GetAll",
			`/`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:GroupController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:GroupController"],
		beego.ControllerComments{
			"GetCountAll",
			`/count`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:GroupController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:GroupController"],
		beego.ControllerComments{
			"Put",
			`/:uid`,
			[]string{"put"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:GroupController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:GroupController"],
		beego.ControllerComments{
			"Delete",
			`/:uid`,
			[]string{"delete"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:UserController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:UserController"],
		beego.ControllerComments{
			"Post",
			`/`,
			[]string{"post"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:UserController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:UserController"],
		beego.ControllerComments{
			"GetAll",
			`/`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:UserController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:UserController"],
		beego.ControllerComments{
			"Get",
			`/:uid`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:UserController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:UserController"],
		beego.ControllerComments{
			"GetByUsername",
			`/find-by-username/:username`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:UserController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:UserController"],
		beego.ControllerComments{
			"Put",
			`/:uid`,
			[]string{"put"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:UserController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:UserController"],
		beego.ControllerComments{
			"Delete",
			`/:uid`,
			[]string{"delete"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:UserController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:UserController"],
		beego.ControllerComments{
			"Login",
			`/login`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:UserController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:UserController"],
		beego.ControllerComments{
			"Logout",
			`/logout`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:UserController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:UserController"],
		beego.ControllerComments{
			"GetAllUserNotifications",
			`/:id/notifications`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:NotificationController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:NotificationController"],
		beego.ControllerComments{
			"Get",
			`/:nid`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:NotificationController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:NotificationController"],
		beego.ControllerComments{
			"GetAll",
			`/`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:NotificationController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:NotificationController"],
		beego.ControllerComments{
			"GetCountAll",
			`/count`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:NotificationController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:NotificationController"],
		beego.ControllerComments{
			"Put",
			`/:uid`,
			[]string{"put"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:NotificationController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:NotificationController"],
		beego.ControllerComments{
			"Delete",
			`/:uid`,
			[]string{"delete"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:PurchaseOrderController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:PurchaseOrderController"],
		beego.ControllerComments{
			"Get",
			`/:uid`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:PurchaseOrderController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:PurchaseOrderController"],
		beego.ControllerComments{
			"GetAll",
			`/`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:PurchaseOrderController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:PurchaseOrderController"],
		beego.ControllerComments{
			"GetCountAll",
			`/count`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:PurchaseOrderController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:PurchaseOrderController"],
		beego.ControllerComments{
			"GetResumePurchases",
			`/resume/:status`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:PurchaseOrderController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:PurchaseOrderController"],
		beego.ControllerComments{
			"Post",
			`/`,
			[]string{"post"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:PurchaseOrderController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:PurchaseOrderController"],
		beego.ControllerComments{
			"Put",
			`/:uid`,
			[]string{"put"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:PurchaseOrderController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:PurchaseOrderController"],
		beego.ControllerComments{
			"Delete",
			`/:uid`,
			[]string{"delete"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CustomerController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CustomerController"],
		beego.ControllerComments{
			"GetAll",
			`/`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CustomerController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CustomerController"],
		beego.ControllerComments{
			"Get",
			`/:uid`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CustomerController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CustomerController"],
		beego.ControllerComments{
			"GetCountAll",
			`/count`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CustomerController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CustomerController"],
		beego.ControllerComments{
			"Put",
			`/:uid`,
			[]string{"put"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CustomerController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CustomerController"],
		beego.ControllerComments{
			"Delete",
			`/:uid`,
			[]string{"delete"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:SchemaController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:SchemaController"],
		beego.ControllerComments{
			"UpdateSchema",
			`/update`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:SchemaController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:SchemaController"],
		beego.ControllerComments{
			"CreateSchema",
			`/create`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:MagentoAccountController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:MagentoAccountController"],
		beego.ControllerComments{
			"GetAll",
			`/`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CompanyController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CompanyController"],
		beego.ControllerComments{
			"Get",
			`/:uid`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CompanyController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CompanyController"],
		beego.ControllerComments{
			"GetAll",
			`/`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CompanyController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CompanyController"],
		beego.ControllerComments{
			"GetCountAll",
			`/count`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CompanyController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CompanyController"],
		beego.ControllerComments{
			"Post",
			`/`,
			[]string{"post"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CompanyController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CompanyController"],
		beego.ControllerComments{
			"Put",
			`/:uid`,
			[]string{"put"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CompanyController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CompanyController"],
		beego.ControllerComments{
			"Delete",
			`/:uid`,
			[]string{"delete"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:ProductController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:ProductController"],
		beego.ControllerComments{
			"Get",
			`/:uid`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:ProductController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:ProductController"],
		beego.ControllerComments{
			"GetAll",
			`/`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:ProductController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:ProductController"],
		beego.ControllerComments{
			"GetCountAll",
			`/count`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:ProductController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:ProductController"],
		beego.ControllerComments{
			"Post",
			`/`,
			[]string{"post"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:ProductController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:ProductController"],
		beego.ControllerComments{
			"Put",
			`/:uid`,
			[]string{"put"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:ProductController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:ProductController"],
		beego.ControllerComments{
			"Delete",
			`/:uid`,
			[]string{"delete"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CountryController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CountryController"],
		beego.ControllerComments{
			"Get",
			`/:uid`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CountryController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CountryController"],
		beego.ControllerComments{
			"GetAll",
			`/`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CountryController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CountryController"],
		beego.ControllerComments{
			"GetByKeyWord",
			`/search/:keyword/:page/:order`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CountryController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:CountryController"],
		beego.ControllerComments{
			"GetCountByKeyWord",
			`/find-count/:keyword`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:ContactController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:ContactController"],
		beego.ControllerComments{
			"Get",
			`/:uid`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:ContactController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:ContactController"],
		beego.ControllerComments{
			"GetAll",
			`/`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:ContactController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:ContactController"],
		beego.ControllerComments{
			"GetCountAll",
			`/count`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:ContactController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:ContactController"],
		beego.ControllerComments{
			"Put",
			`/:uid`,
			[]string{"put"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:ContactController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:ContactController"],
		beego.ControllerComments{
			"Delete",
			`/:uid`,
			[]string{"delete"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:VendorController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:VendorController"],
		beego.ControllerComments{
			"GetAll",
			`/`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:VendorController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:VendorController"],
		beego.ControllerComments{
			"Get",
			`/:uid`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:VendorController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:VendorController"],
		beego.ControllerComments{
			"GetCountAll",
			`/count`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:VendorController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:VendorController"],
		beego.ControllerComments{
			"Put",
			`/:uid`,
			[]string{"put"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:VendorController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:VendorController"],
		beego.ControllerComments{
			"Delete",
			`/:uid`,
			[]string{"delete"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:StateController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:StateController"],
		beego.ControllerComments{
			"Get",
			`/:uid`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:StateController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:StateController"],
		beego.ControllerComments{
			"GetAll",
			`/`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:StateController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:StateController"],
		beego.ControllerComments{
			"GetByKeyWord",
			`/search/:keyword/:page/:order`,
			[]string{"get"},
			nil})

	beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:StateController"] = append(beego.GlobalControllerRouter["github.com/sam/inventory-api/controllers:StateController"],
		beego.ControllerComments{
			"GetCountByKeyWord",
			`/find-count/:keyword`,
			[]string{"get"},
			nil})

}
