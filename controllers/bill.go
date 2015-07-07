package controllers

import (
	"github.com/gorilla/mux"
	"net/http"

	"encoding/json"
	"io/ioutil"

	"appengine"

	"handler"
	"math"
	"models"
	"validation"
)

type BillController struct {
}

func (c *BillController) RegisterHandlers(r *mux.Router) {
	r.Handle("/bill/count", handler.New(c.Count)).Methods("GET")
	r.Handle("/bill/{uid:[a-zA-Z0-9\\-]+}", handler.New(c.Get)).Methods("GET")
	r.Handle("/bill", handler.New(c.GetAll)).Methods("GET")
	r.Handle("/bill", handler.New(c.Post)).Methods("POST")
	r.Handle("/bill/{uid:[a-zA-Z0-9\\-]+}", handler.New(c.Put)).Methods("PUT")
	r.Handle("/bill/{uid:[a-zA-Z0-9\\-]+}", handler.New(c.Delete)).Methods("DELETE")
	r.Handle("/bill/count", handler.New(c.Count)).Methods("GET")
	r.Handle("/bill/resume/{status}", handler.New(c.GetResumeBills)).Methods("GET")
	r.Handle("/bill/{uid:[a-zA-Z0-9\\-]+}/products", handler.New(c.GetAllProducts)).Methods("GET")
}

// @Title Get
// @Description get bill order by uid
// @Param	uid		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Bill
// @Failure 403 :uid is empty
// @router /:uid [get]
func (c *BillController) Get(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	bill, err := models.GetBill(uid)
	if err != nil {
		return nil, &handler.Error{err, "Error querying database", http.StatusInternalServerError}
	}

	return bill, nil
}

// @Title Get
// @Description get all Billes
// @Param	page	    int
// @Param	sort		string
// @Param	keyword		string
// @Param	status		string
// @Success 200 {array} models.Bill
// @router / [get]
func (c *BillController) GetAll(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	status := models.BILL_ALL
	if statusP := request.URL.Query().Get("status"); statusP != "" {
		status = statusP
	}

	var bills *[]models.Bill
	page, sort, keyword := ParseParamsOfGetRequest(request.URL.Query())
	if keyword != "" {
		bills, _ = models.GetBillByKeyword(keyword, page, sort, false, -1)
	} else {
		bills, _ = models.GetAllBill(status, page, sort, false, -1)
	}

	return bills, nil
}

// @Title Get Count Companies
// @Description get count Companies
// @Param	keyword		string
// @Success 200 {array} models.Bill
// @router /count [get]
func (c *BillController) Count(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	total := make(map[string]interface{})

	status := models.BILL_ALL
	if statusP := request.URL.Query().Get("status"); statusP != "" {
		status = statusP
	}

	keyword := ""
	if keywordP := request.URL.Query().Get("keyword"); keywordP != "" {
		keyword = keywordP
		_, total["total"] = models.GetBillByKeyword(keyword, 1, "notSorting", true, -1)
	} else {
		_, total["total"] = models.GetAllBill(status, 1, "notSorting", true, -1)
	}

	return total, nil
}

// @Title Get Resume from Purchases
// @Description get Resume from Purchases
// @Param	status	int
// @Success int
// @router /resume/:status [get]
func (c *BillController) GetResumeBills(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	status := v["status"]
	total := make(map[string]interface{})
	total["amount"], total["cant"] = models.GetBillResume(status)

	return total, nil
}

// @Title createBill
// @Description create bills
// @Param	body		body 	models.Bill	true		"body for user content"
// @Success 200 {int} models.User.Id
// @Failure 403 body is empty
// @router / [post]
func (c *BillController) Post(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {

	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}

	var bill models.Bill
	err = json.Unmarshal(data, &bill)
	if err != nil {
		panic(err)
	}
	user, _ := models.GetCurrentUser(request)
	bill.Creator = user
	bill.Updater = user

	bill.Company = user.Company

	billItems := bill.BillItems
	bill.BillItems = nil

	var subTotal float32 = 0
	for i := 0; i < len(billItems); i++ {
		subTotal += float32(billItems[i].Price) * float32(billItems[i].QuantitySolicited)
		product, _ := models.GetProduct(billItems[i].Product.Id)
		billItems[i].Product = product
	}
	bill.SubTotal = BillRoundPlus((subTotal), 2)
	bill.TotalTax = BillRoundPlus((subTotal*float32(bill.Tax))/100, 2)
	bill.Amount = bill.TotalTax + bill.SubTotal
	bill.OrderNumber = models.GetBillMaxOrderNumber()
	bill.Status = models.BILL_DRAFT

	valid := validation.Validation{}
	b, err := valid.Valid(&bill)

	if err != nil {
		return nil, &handler.Error{err, "Validation errors", http.StatusNoContent}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusNoContent}
		}
		return nil, &handler.Error{nil, "Entity not found", http.StatusNoContent}
	} else {
		models.AddBill(&bill)
		for i := 0; i < len(billItems); i++ {
			var billItem = billItems[i]
			billItem.Creator = user
			billItem.Updater = user
			billItem.Bill = &bill
			models.AddBillItem(billItem)
		}
	}

	return bill, nil
}

// @Title updateBill
// @Description update bills
// @Param	body		body 	models.Bill	true		"body for user content"
// @Success 200 {int} models.User.Id
// @Failure 403 body is empty
// @router /:uid [put]
func (c *BillController) Put(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {

	data, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return nil, &handler.Error{err, "Could not read request", http.StatusBadRequest}
	}
	var bill models.Bill
	json.Unmarshal(data, &bill)
	user, _ := models.GetCurrentUser(request)
	billItems := bill.BillItems
	if billItems != nil {
		bill.Updater = user

		bill.BillItems = nil

		var subTotal float32 = 0
		for i := 0; i < len(billItems); i++ {
			subTotal += float32(billItems[i].Price) * float32(billItems[i].QuantitySolicited)
			product, _ := models.GetProduct(billItems[i].Product.Id)
			billItems[i].Product = product
		}
		bill.SubTotal = BillRoundPlus((subTotal), 2)
		bill.TotalTax = BillRoundPlus((subTotal*float32(bill.Tax))/100, 2)
		bill.Amount = bill.TotalTax + bill.SubTotal
		//	bill.Status = models.PURCHASE_DRAFT
	} else {
		uid := v["uid"]
		status := bill.Status
		bill, _ := models.GetBill(uid)
		bill.Updater = user
		bill.Status = status
	}

	valid := validation.Validation{}
	b, err := valid.Valid(&bill)
	if err != nil {
		return nil, &handler.Error{err, "Validation errors", http.StatusNoContent}
	}
	if !b {
		for _, err := range valid.Errors {
			return nil, &handler.Error{nil, err.Message, http.StatusNoContent}
		}
		return nil, &handler.Error{nil, "Entity not found", http.StatusNoContent}
	} else {
		models.UpdateBill(&bill)
		if billItems != nil {
			idsBillItem := make([]string, len(billItems))
			for i := 0; i < len(billItems); i++ {
				var billItem = billItems[i]
				billItem.Updater = user
				billItem.Bill = &bill
				if billItem.Id != "" {
					idsBillItem[i] = billItem.Id
					models.UpdateBillItem(billItem)
				} else {
					billItem.Creator = user
					idsBillItem[i] = models.AddBillItem(billItem)
				}
			}
			billItemsDelete := models.GetAllBillItemsToDelete(bill.Id, idsBillItem)
			for i := 0; i < len(billItemsDelete); i++ {
				models.DeleteBillItem(&billItemsDelete[i])
			}
		}
	}

	return bill, nil

}

// @Title delete
// @Description delete the Bill
// @Param	uid		path 	string	true		"The uid you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 uid is empty
// @router /:uid [delete]
func (controller *BillController) Delete(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uid := v["uid"]

	bill, err := models.GetBill(uid)
	if err != nil {
		return nil, &handler.Error{err, "Entity not found", http.StatusNoContent}
	}

	models.DeleteBill(bill)

	return nil, nil
}

// @Title Get
// @Description get all Invoices
// @Success 200 {object} models.Invoice
// @router /:id/products [get]
func (controller *BillController) GetAllProducts(context appengine.Context, writer http.ResponseWriter, request *http.Request, v map[string]string) (interface{}, *handler.Error) {
	uidBill := v["uid"]
	var billItems []models.BillItem = models.GetAllBillItems(uidBill)
	return billItems, nil
}

func BillRoundPlus(f float32, places int) float32 {
	shift := math.Pow(10, float64(places))
	return float32(BillRound(float64(f)*shift) / shift)
}
func BillRound(f float64) float64 {
	return float64(math.Floor(f + .5))
}
