package models

import (
	"errors"
	"github.com/astaxie/beego/orm"
	"time"
)

func init() {
	orm.RegisterModel(new(User))
}

type User struct {
	Id                     string `orm:"pk"`
	Country                string
	Organization           *Organization `orm:"rel(one)"`
	Creator                *User         `orm:"rel(one)"`
	Updater                *User         `orm:"rel(one)"`
	FirstName              string
	LastName               string
	MiddleName             string
	DateOfBirth            string
	Gender                 string
	Race                   string
	SSN                    string `orm:"column(ssn)"`
	DriverLicense          string
	Address1               string
	Address2               string
	Address3               string
	City                   string
	State                  string
	Postal                 string
	BirthPlace             string
	Phone1                 string
	Phone2                 string
	Username               string
	Password               string
	Email                  string
	Status                 bool
	Locked                 bool
	LockedReason           string
	LockedBy               string
	LockedDate             time.Time `orm:"auto_now_add;type(datetime)"`
	LockedTimeZone         int
	PasswordExpirationDate time.Time `orm:"auto_now_add;type(datetime)"`
	Token                  string
	TokenExpirationDate    time.Time `orm:"auto_now_add;type(datetime)"`
	Created                time.Time `orm:"auto_now_add;type(datetime)"`
	CreatedTimeZone        int
	Updated                time.Time `orm:"auto_now_add;type(datetime)"`
	UpdatedTimeZone        int
	isActive               bool
	Deleted                bool
	Group                  *UserGroup `orm:"rel(one)"`
	Company                *Company   `orm:"rel(one)"`
}

type Token struct {
	Token   string
	Expires time.Time
}

func AddUser(u User) string {
	o := orm.NewOrm()
	o.Insert(&u)

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
	token := Token{Token: "24234234", Expires: time.Now()}

	return token, nil
}

func DeleteUser(uid string) {

}
