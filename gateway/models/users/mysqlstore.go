package users

import (
	"context"
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
	userNew := &User{}
	sqlQuery := "select UserID, UserEmail, UserPassHash, UserName, EmailVerified from Users where UserID=@U_ID"
	res := msq.db.QueryRowContext(context.Background(), sqlQuery, sql.Named("U_ID", id))
	if err := res.Scan(&userNew.ID, &userNew.Email, &userNew.PassHash, &userNew.UserName); err != nil {
		return nil, err
	}
	if err := res.Err(); err != nil {
		return nil, err
	}
	return userNew, nil
}

//GetByEmail returns the User with the given email
func (msq *MSSQLStore) GetByEmail(email string) (*User, error) {
	userNew := &User{}
	sqlQuery := "select UserID, UserEmail, UserPassHash, UserName, EmailVerified from Users where UserEmail=@UE"
	res := msq.db.QueryRowContext(context.Background(), sqlQuery, sql.Named("UE", email))
	if err := res.Scan(&userNew.ID, &userNew.Email, &userNew.PassHash, &userNew.UserName); err != nil {
		return nil, err
	}
	if err := res.Err(); err != nil {
		return nil, err
	}
	return userNew, nil
}

//GetByUserName returns the User with the given Username
func (msq *MSSQLStore) GetByUserName(username string) (*User, error) {
	userNew := &User{}
	sqlQuery := "select UserID, UserEmail, UserPassHash, UserName, EmailVerified from Users where UserName=@UN"
	res := msq.db.QueryRowContext(context.Background(), sqlQuery, sql.Named("UN", username))
	if err := res.Scan(&userNew.ID, &userNew.Email, &userNew.PassHash, &userNew.UserName); err != nil {
		return nil, err
	}
	if err := res.Err(); err != nil {
		return nil, err
	}
	return userNew, nil
}

//Insert inserts the user into the database, and returns
//the newly-inserted User, complete with the DBMS-assigned ID
func (msq *MSSQLStore) Insert(user *User) (*User, error) {
	insq := `insert into Users(UserEmail, UserPassHash, UserName, EmailVerified) 
	values (@UE, @UPH, @UN, @EV)`
	res, err := msq.db.ExecContext(context.Background(), insq, user.Email, user.PassHash, user.UserName,
		user.EmailVerified)
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
