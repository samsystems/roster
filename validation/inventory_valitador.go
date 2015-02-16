package validation

import (
	"fmt"
	"github.com/astaxie/beego/orm"
	"reflect"
)

type Entity struct {
	EntityName string
	Key        string
}

func (e Entity) DefaultMessage() string {
	return fmt.Sprint(e.EntityName + " required.")
}

func (e Entity) GetKey() string {
	return e.Key
}

func (e Entity) GetLimitValue() interface{} {

	return nil
}

func (e Entity) IsSatisfied(obj interface{}) bool {
	objT := reflect.TypeOf(obj)
	if objT.Kind() == reflect.Ptr {
		objT = objT.Elem()
	}
	if obj == nil {
		return false
	} else if objT.Kind() != reflect.Struct {
		return false
	} else if reflect.ValueOf(obj).IsNil() {
		return false
	}
	o := orm.NewOrm()
	err := o.Read(obj)
	if err != nil {
		return false
	} else {
		return true
	}
}

func (v *Validation) Entity(obj interface{}, entityName, key string) *ValidationResult {
	return v.apply(Entity{entityName, key}, obj)
}
