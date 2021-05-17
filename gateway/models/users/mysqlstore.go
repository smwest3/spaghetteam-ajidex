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
	sqlQuery := "select UserID, UserEmail, UserPassHash, UserName from Users where UserID=@U_ID"
	res := msq.db.QueryRowContext(context.Background(), sqlQuery, sql.Named("U_ID", id))
	if err := res.Scan(&userNew.ID, &userNew.Email, &userNew.PassHash, &userNew.UserName); err != nil {
		return nil, err
	}
	if err := res.Err(); err != nil {
		return nil, err
	}
	var err error
	userNew.Restrictions, err = msq.GetUserRestrictions(userNew)
	if err != nil {
		return nil, err
	}
	return userNew, nil
}

//GetByEmail returns the User with the given email
func (msq *MSSQLStore) GetByEmail(email string) (*User, error) {
	userNew := &User{}
	sqlQuery := "select UserID, UserEmail, UserPassHash, UserName from Users where UserEmail=@UE"
	res := msq.db.QueryRowContext(context.Background(), sqlQuery, sql.Named("UE", email))
	if err := res.Scan(&userNew.ID, &userNew.Email, &userNew.PassHash, &userNew.UserName); err != nil {
		return nil, err
	}
	if err := res.Err(); err != nil {
		return nil, err
	}
	var err error
	userNew.Restrictions, err = msq.GetUserRestrictions(userNew)
	if err != nil {
		return nil, err
	}
	return userNew, nil
}

//GetByUserName returns the User with the given Username
func (msq *MSSQLStore) GetByUserName(username string) (*User, error) {
	userNew := &User{}
	sqlQuery := "select UserID, UserEmail, UserPassHash, UserName from Users where UserName=@UN"
	res := msq.db.QueryRowContext(context.Background(), sqlQuery, sql.Named("UN", username))
	if err := res.Scan(&userNew.ID, &userNew.Email, &userNew.PassHash, &userNew.UserName); err != nil {
		return nil, err
	}
	if err := res.Err(); err != nil {
		return nil, err
	}
	var err error
	userNew.Restrictions, err = msq.GetUserRestrictions(userNew)
	if err != nil {
		return nil, err
	}
	return userNew, nil
}

//GetUserRestrictions retrieves the restrictions of a particular user
func (msq *MSSQLStore) GetUserRestrictions(user *User) ([]*Restriction, error) {
	restrictions := []*Restriction{}
	sqlQuery := `select RestrictionName, RestrictionType
	from Restriction R
	join RestrictionType RT on R.RestrictionTypeID=RT.RestrictionTypeID
	join UserRestriction UR on R.RestrictionID=UR.RestrictionID
	join Users U on UR.UserID=U.UserID
	where UserID = @U_ID`
	rows, err := msq.db.QueryContext(context.Background(), sqlQuery, sql.Named("U_ID", user.ID))
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		thisRestriction := &Restriction{}
		if err := rows.Scan(&thisRestriction.RestrictName, &thisRestriction.RestrictType); err != nil {
			return nil, err
		}
		restrictions = append(restrictions, thisRestriction)
	}
	if rows.Err(); err != nil {
		return nil, err
	}
	return restrictions, nil
}

//InsertUserRestrictions inserts the restrictions of a particular user
func (msq *MSSQLStore) InsertUserRestrictions(userID int64, inputRestr []*Restriction) error {
	//IMPLEMENT ME
	//types: texture, ingredienttype (meat, dairy etc.), allergen
	sqlExec := `insert into UserRestriction(UserID, RestrictionID)
	values (@U_ID, (select RestrictionID 
					from Restriction R
					join RestrictionType RT on R.RestrictionTypeID=RT.RestrictionTypeID
					where R.RestrictionName = @R_N
					and RT.RestrictionTypeName = @RT_N))`
	for _, restrictions := range inputRestr {
		_, err := msq.db.ExecContext(context.Background(), sqlExec,
			sql.Named("U_ID", userID), sql.Named("R_N", restrictions.RestrictName),
			sql.Named("RT_N", restrictions.RestrictType))
		if err != nil {
			return err
		}
	}
	return nil
}

//Insert inserts the user into the database, and returns
//the newly-inserted User, complete with the DBMS-assigned ID
func (msq *MSSQLStore) Insert(user *User) (*User, error) {
	insq := `insert into Users(UserEmail, UserPassHash, UserName) 
	values (@UE, @UPH, @UN)`
	res, err := msq.db.ExecContext(context.Background(), insq, sql.Named("UE", user.Email),
		sql.Named("UPH", user.PassHash), sql.Named("UN", user.UserName))
	if err != nil {
		return nil, err
	}
	//get the auto-assigned ID for the new row
	id, errTwo := res.LastInsertId()
	if errTwo != nil {
		return nil, errTwo
	}
	err = msq.InsertUserRestrictions(id, user.Restrictions)
	if err != nil {
		return nil, err
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
	delq := "delete from UserRestriction where UserID = @U_ID"
	_, err := msq.db.ExecContext(context.Background(), delq, sql.Named("U_ID", id))
	if err != nil {
		return errors.New("error deleting User")
	}
	secondDelq := "delete from users where id = @U_ID"
	_, err = msq.db.ExecContext(context.Background(), secondDelq, sql.Named("U_ID", id))
	if err != nil {
		return errors.New("error deleting User")
	}
	return nil
}
