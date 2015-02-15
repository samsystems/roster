// @APIVersion 1.0.0
// @Title Sam Inventory API
// @Description This is the API used in Sam's inventory system
// @Contact damnpoet@gmail.com
// @TermsOfServiceUrl http://samsystems.io/
// @License Apache 2.0
// @LicenseUrl http://www.apache.org/licenses/LICENSE-2.0.html
package routers

import (
	"github.com/sam/inventory-api/controllers"

	"github.com/astaxie/beego"
)

func init() {
	ns := beego.NewNamespace("/v1",
		beego.NSNamespace("/user",
			beego.NSInclude(
				&controllers.UserController{},
			),
		),
		beego.NSNamespace("/contact",
			beego.NSInclude(
				&controllers.ContactController{},
			),
		),
		beego.NSNamespace("/company",
			beego.NSInclude(
				&controllers.CompanyController{},
			),
		),
		beego.NSNamespace("/country",
			beego.NSInclude(
				&controllers.CountryController{},
			),
		),
		beego.NSNamespace("/state",
			beego.NSInclude(
				&controllers.StateController{},
			),
		),
		beego.NSNamespace("/product",
			beego.NSInclude(
				&controllers.ProductController{},
			),
		),
		beego.NSNamespace("/customer",
			beego.NSInclude(
				&controllers.CustomerController{},
			),
		),
		beego.NSNamespace("/invoice",
			beego.NSInclude(
				&controllers.InvoiceController{},
			),
		),
		beego.NSNamespace("/notification",
			beego.NSInclude(
				&controllers.NotificationController{},
			),
		),
		beego.NSNamespace("/vendor",
			beego.NSInclude(
				&controllers.VendorController{},
			),
		),
		beego.NSNamespace("/magento/account",
			beego.NSInclude(
				&controllers.MagentoAccountController{},
			),
		),
		beego.NSNamespace("/group",
			beego.NSInclude(
				&controllers.GroupController{},
			),
		),
		beego.NSNamespace("/purchase",
			beego.NSInclude(
				&controllers.PurchaseOrderController{},
			),
		),
	)
	beego.AddNamespace(ns)
}
