package users

import (
	"database/sql"
	"errors"

	//importing the MSSQL driver without creating a local name for the package in our code
	_ "github.com/denisenkom/go-mssqldb"
)

// MSSQLStore represents a MSSQL store
type MSSQLStore struct {
	db *sql.DB
}

//NewMSSQLStore constructs and returns a new MSSQLStore
func NewMSSQLStore(DB *sql.DB) *MSSQLStore {
	return &MSSQLStore{
		db: DB,
	}
}

//GetByID returns the User with the given ID
func (msq *MSSQLStore) GetByID(id int64) (*User, error) {
	sqlQuery := "select id,email,passHash,username from Users where id=?"
	res, err := msq.db.Query(sqlQuery, id)
	if err != nil {
		return nil, err
	}
	var userNew User
	for res.Next() {
		res.Scan(&userNew.ID, &userNew.Email, &userNew.PassHash, &userNew.UserName)
	}
	return &userNew, err
}

//GetByEmail returns the User with the given email
func (msq *MSSQLStore) GetByEmail(email string) (*User, error) {
	sqlQuery := "select id,email,passHash,username from Users where email=?"
	res, err := msq.db.Query(sqlQuery, email)
	if err != nil {
		return nil, err
	}
	var userNew User
	for res.Next() {
		res.Scan(&userNew.ID, &userNew.Email, &userNew.PassHash, &userNew.UserName)
	}
	return &userNew, err
}

//GetByUserName returns the User with the given Username
func (msq *MSSQLStore) GetByUserName(username string) (*User, error) {
	sqlQuery := "select id,email,passHash,username from Users where username=?"
	res, err := msq.db.Query(sqlQuery, username)
	if err != nil {
		return nil, err
	}
	var userNew User
	for res.Next() {
		res.Scan(&userNew.ID, &userNew.Email, &userNew.PassHash, &userNew.UserName)
	}
	return &userNew, err
}

//Insert inserts the user into the database, and returns
//the newly-inserted User, complete with the DBMS-assigned ID
func (msq *MSSQLStore) Insert(user *User) (*User, error) {
	insq := "insert into Users(email, passHash, username) values (?, ?, ?)"

	res, err := msq.db.Exec(insq, user.Email, user.PassHash, user.UserName)
	if err != nil {
		return nil, err
	}

	//get the auto-assigned ID for the new row
	id, errTwo := res.LastInsertId()
	if errTwo != nil {
		return nil, errTwo
	}

	return msq.GetByID(id)
}

//Update applies UserUpdates to the given user ID
//and returns the newly-updated user
func (msq *MSSQLStore) Update(id int64, updates *Updates) (*User, error) {
	updq := "update Users set firstName = ?, lastName = ?, bio = ? where id = ? "
	_, err := msq.db.Exec(updq, updates.FirstName, updates.LastName, updates.Bio, id)
	if err != nil {
		return nil, errors.New("error updating User")
	}
	return msq.GetByID(id)
}

//Delete deletes the user with the given ID
func (msq *MSSQLStore) Delete(id int64) error {
	delq := "delete from users where id = ?"
	_, err := msq.db.Exec(delq, id)
	if err != nil {
		return errors.New("error deleting User")
	}
	return nil
}
