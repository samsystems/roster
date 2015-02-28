package models

import (
	"errors"
	"code.google.com/p/go-uuid/uuid"
	"github.com/astaxie/beego/orm"
	"time"
)

func init() {
	orm.RegisterModel(new(User))
}

type User struct {
	Id                     string        `orm:"pk"`
	Country                *Country      `orm:"rel(one)"`
	Organization           *Organization `orm:"rel(one)"`
	Creator                *User         `orm:"rel(one)"`
	Updater                *User         `orm:"rel(one)"`
	FirstName              string
	LastName               string
	MiddleName             string
	Dob                    time.Time     `orm:"type(datetime)" json:"DOB"`
	Gender                 string
	Race                   string
	SSN                    string 		 `orm:"column(ssn)"`
	DriverLicense          string
	Address1               string 		 `json:"Address"`
	Address2               string
	Address3               string
	Apto                   string
	City                   string
	State                  *State  		 `orm:"rel(one)"`
	Postal                 string  		 `json:"Zipcode"`
	BirthPlace             string 		 
	Phone1                 string  		 `json:"Phone"`
	Phone2                 string
	Username               string
	Password               string
	Email                  string
	Business               string
	EmployerNumber         string
	Status                 bool
	Locked                 bool
	LockedReason           string
	LockedBy               string
	LockedDate             time.Time     `orm:"auto_now_add;type(datetime)"`
	LockedTimeZone         int
	PasswordExpirationDate time.Time     `orm:"auto_now_add;type(datetime)"`
	Token                  string
	TokenExpirationDate    time.Time     `orm:"auto_now_add;type(datetime)"`
	Created                time.Time     `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone        int
	Updated                time.Time 	 `orm:"auto_now_add;type(datetime)"`
	UpdatedTimeZone        int
	isActive               bool
	Deleted                bool
	Group                  *Group 		 `orm:"rel(one)"`
	Company                *Company      `orm:"rel(one)"`
	Industry               *Industry     `orm:"rel(one)"`
}

type Token struct {
	Token   string
	Expires time.Time
}

func AddUser(u User) string {
	o := orm.NewOrm()
	
	u.Id = uuid.New()
	_, err :=o.Insert(&u)
	if err != nil {
		panic(err)
	}
	return u.Id
}

func GetUser(uid string) (*User, error) {
	u := User{Id: uid}
	o := orm.NewOrm()
	err := o.Read(&u)

	return &u, err
}

func GetUserByUsername(username string) (*User, error) {
	o := orm.NewOrm()
	user := User{Username: username}
	err := o.Read(&user, "Username")

	if err == nil {
		return &user, nil
	}
	return nil, errors.New("User not exists")
}

func GetAllUsers() []*User {
	o := orm.NewOrm()

	var users []*User
	qs := o.QueryTable("user")
	qs.Filter("deleted", false).All(&users)

	return users
}

func UpdateUser(uid string, uu *User) (a *User, err error) {
	return nil, nil
}

func Login(username string, password string) (Token, error) {
	token := Token{Token: "$1$dlPL2MqE$oQmn16q49SqdmhenQuNgs1", Expires: time.Now()}

	return token, nil
}

func DeleteUser(uid string) {

}
