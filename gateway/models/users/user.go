package users

import (
	"errors"
	"fmt"
	"net/mail"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

//bcryptCost is the default bcrypt cost to use when hashing passwords
var bcryptCost = 13

//User represents a user account in the database
type User struct {
	ID            int64  `json:"id"`
	Email         string `json:"-"` //never JSON encoded/decoded
	PassHash      []byte `json:"-"` //never JSON encoded/decoded
	UserName      string `json:"userName"`
	EmailVerified bool   `json:"emailverified"`
}

//Credentials represents user sign-in credentials
type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

//NewUser represents a new user signing up for an account
type NewUser struct {
	Email        string `json:"email"`
	Password     string `json:"password"`
	PasswordConf string `json:"passwordConf"`
	UserName     string `json:"userName"`
}

//Updates represents allowed updates to a user profile
type Updates struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Bio       string `json:"bio"`
}

//Validate validates the new user and returns an error if
//any of the validation rules fail, or nil if its valid
func (nu *NewUser) Validate() error {
	_, err := mail.ParseAddress(nu.Email)
	if err != nil {
		return fmt.Errorf("Not a valid email address")
	}
	if len(nu.Password) < 6 {
		return fmt.Errorf("Password must be at least 6 characters")
	}
	if nu.Password != nu.PasswordConf {
		return fmt.Errorf("Passwords do not match")
	}
	if nu.UserName == "" || strings.Contains(nu.UserName, " ") {
		return fmt.Errorf("UserName must be non-zero length and may not contain spaces")
	}

	return nil
}

//ToUser converts the NewUser to a User, setting the
//PhotoURL and PassHash fields appropriately
func (nu *NewUser) ToUser() (*User, error) {
	err := nu.Validate()
	if err != nil {
		return nil, err
	}

	result := &User{
		ID:            int64(0),
		Email:         nu.Email,
		UserName:      nu.UserName,
		EmailVerified: false,
	}

	errTwo := result.SetPassword(nu.Password)
	if errTwo != nil {
		return nil, errTwo
	}

	return result, nil
}

//SetPassword hashes the password and stores it in the PassHash field
func (u *User) SetPassword(password string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), 13)
	if err != nil {
		return errors.New("error generating bcrypt hash")
	}
	u.PassHash = hash
	return nil
}

//Authenticate compares the plaintext password against the stored hash
//and returns an error if they don't match, or nil if they do
func (u *User) Authenticate(password string) error {
	if err := bcrypt.CompareHashAndPassword(u.PassHash, []byte(password)); err != nil {
		return errors.New("password doesn't match stored hash")
	}
	return nil
}

// BELOW CODE WILL CHANGE TO ADAPT TO AJIDEX
//ApplyUpdates applies the updates to the user. An error
//is returned if the updates are invalid
/*func (u *User) ApplyUpdates(updates *Updates) error {
	if updates.FirstName == "" || updates.LastName == "" {
		return errors.New("Updates are invalid")
	}

	u.FirstName = updates.FirstName
	u.LastName = updates.LastName

	if updates.Bio != "" {
		u.Bio = updates.Bio
	}

	return nil
}*/
