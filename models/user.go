package models

import (
	"code.google.com/p/go-uuid/uuid"
	"crypto/rand"
	"crypto/sha1"
	"encoding/hex"
	"errors"
	"github.com/astaxie/beego/orm"
	"net/http"
	"time"
)
const USER_LIMIT int = 20
func init() {
	orm.RegisterModel(new(User))
}

type User struct {
	Id                     string   `orm:"pk"`
	Country                *Country `orm:"rel(one)"`
	Creator                *User    `orm:"rel(one)"`
	Updater                *User    `orm:"rel(one)"`
	FirstName              string
	LastName               string
	MiddleName             string
	Dob                    time.Time `orm:"type(datetime)" json:"DOB"`
	Gender                 string
	Race                   string
	SSN                    string `orm:"column(ssn)"`
	DriverLicense          string
	Address1               string `json:"Address"`
	Address2               string
	Address3               string
	Apto                   string
	City                   string
	State                  *State `orm:"null;rel(one)"`
	Postal                 string `json:"Zipcode"`
	BirthPlace             string
	Phone1                 string `json:"Phone"`
	Phone2                 string
	Username               string
	Password               string
	Email                  string
	EmployerNumber         string
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
	isActive               bool `orm:"default(false)"`
	Deleted                bool
	Group                  *Group   `orm:"rel(one)"`
	Company                *Company `orm:"null;rel(one)"`
}

type Token struct {
	Token   string
	Expires time.Time
}

func AddUser(u *User) string {
	o := orm.NewOrm()

	u.Id = uuid.New()
	_, err := o.Insert(u)
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
	return nil, err
}

func GetUserByToken(token string) (*User, error) {
	o := orm.NewOrm()
	var user User
	o.QueryTable("user").Filter("token", token).One(&user)
	return &user, errors.New("User not exists!!!")
}

func GetCurrentUser(request *http.Request) (*User, error) {
	var token string = request.Header.Get("Access-Token")
	return GetUserByToken(token)
}

func GetAllUsers() []*User {
	o := orm.NewOrm()

	var users []*User
	qs := o.QueryTable("user")
	_, err := qs.Filter("deleted", false).All(&users)
	if err != nil {
		panic(err)
	}
	return users
}

func GetUserByKeyword(keyword string, user *User, page int, order string, count bool, limit int) ([]User, interface{}) {
	var users []User
	qb, _ := orm.NewQueryBuilder("mysql")
	page -= 1
	if limit < 0 {
		limit = USER_LIMIT
	}
	// Construct query object
	if count == false {
		qb.Select("user.*")
	} else {
		qb.Select("count(user.id)")
	}

	qb.From("user user").
		Where("user.name LIKE ?").And("user.company_id = ?")

	if count == true {
		sql := qb.String()
		var total int
		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%", user.Company.Id).QueryRow(&total)
		return users, total

	} else {
		ParseQueryBuilderOrder(qb, order, "user")
		qb.Limit(limit).Offset(page * USER_LIMIT)

		// export raw query string from QueryBuilder object
		sql := qb.String()

		// execute the raw query string
		o := orm.NewOrm()
		o.Raw(sql, "%"+keyword+"%", user.Company.Id).QueryRows(&users)
		return users, nil
	}

}

func UpdateUser(user *User) {
	o := orm.NewOrm()
	o.Update(user)
}

func PasswordMatches(user *User, password string) bool {
	hasher := sha1.New()
	hasher.Write([]byte(password))

	if user.Password == hex.EncodeToString(hasher.Sum(nil)) {
		return true
	}
	return false
}

func EncriptPassword(password string) string {
	hasher := sha1.New()
	hasher.Write([]byte(password))
	return hex.EncodeToString(hasher.Sum(nil))
}

func GenerateToken(size int) string {
	TokenHash := sha1.New()
	token := make([]byte, size)
	rand.Read(token)
	TokenHash.Write([]byte(token))

	return hex.EncodeToString(TokenHash.Sum(nil))
}

func Login(username string, password string) (*Token, error) {
	token := Token{Token: "1113", Expires: time.Now()}

	var authenticated bool = false
	if username != "" {
		user, err := GetUserByUsername(username)
		if user != nil && user.Id != "" {
			authenticated = PasswordMatches(user, password)
			if authenticated {
				token.Token = GenerateToken(32)
				token.Expires = token.Expires.AddDate(0, 0, 1)
				user.Token = token.Token
				user.TokenExpirationDate = token.Expires

				UpdateUser(user)

				return &token, nil
			} else {
				return nil, errors.New("The password provided is invalid")
			}

		} else {
			return nil, err
		}

	}

	return nil, errors.New("Invalid username and/or password")
}

func DeleteUser(uid string) {

}