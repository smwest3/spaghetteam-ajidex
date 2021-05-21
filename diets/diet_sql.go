package main

import (
	"context"
	"database/sql"
	"time"

	//importing the MSSQL driver without creating a local name for the package in our code
	_ "github.com/denisenkom/go-mssqldb"
)

//SQLStore holds mssql db
type MSSQLStore struct {
	db     *sql.DB
	sqlctx context.Context
}

//Restriction represents an individual restriction a user may have
type Restriction struct {
	RestrictName string `json:"restrictname"`
	RestrictType string `json:"restricttype"`
}

type InputRestriction struct {
	RestrictName string `json:"restrictname"`
	RestrictType string `json:"restricttype"`
	ActionToDo   string `json:"actiontodo"`
}

//NewSQLStore creates and returns a new SQLStore
func NewSQLStore(db *sql.DB) MSSQLStore {
	sqlctx, cancel := context.WithTimeout(context.Background(), 300*time.Second)
	defer cancel()

	return MSSQLStore{db, sqlctx}
}

//GetUserRestrictions retrieves the restrictions of a particular user
func (msq *MSSQLStore) GetUserRestrictions(userID int64) ([]*Restriction, error) {
	restrictions := []*Restriction{}
	sqlQuery := `select RestrictionName, RestrictionTypeName
	from Restriction R
	join RestrictionType RT on R.RestrictionTypeID=RT.RestrictionTypeID
	join UserRestriction UR on R.RestrictionID=UR.RestrictionID
	join Users U on UR.UserID=U.UserID
	where U.UserID = @U_ID`
	rows, err := msq.db.QueryContext(context.Background(), sqlQuery, sql.Named("U_ID", userID))
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

func (msq *MSSQLStore) EditUserRestriction(userID int64, inputRestr []InputRestriction) error {
	for _, restriction := range inputRestr {
		if restriction.ActionToDo == "add" {
			if err := msq.InsertUserRestriction(userID, restriction); err != nil {
				return err
			}
		} else if restriction.ActionToDo == "delete" {
			if err := msq.DeleteUserRestriction(userID, restriction); err != nil {
				return err
			}
		}
	}
	return nil
}

//InsertUserRestrictions inserts the restrictions of a particular user
func (msq *MSSQLStore) InsertUserRestriction(userID int64, inputRestr InputRestriction) error {
	sqlExec := `insert into UserRestriction(UserID, RestrictionID)
	values (@U_ID, (select RestrictionID 
					from Restriction R
					join RestrictionType RT on R.RestrictionTypeID=RT.RestrictionTypeID
					where R.RestrictionName = @R_N
					and RT.RestrictionTypeName = @RT_N))`
	_, err := msq.db.ExecContext(context.Background(), sqlExec,
		sql.Named("U_ID", userID), sql.Named("R_N", inputRestr.RestrictName),
		sql.Named("RT_N", inputRestr.RestrictType))
	if err != nil {
		return err
	}
	return nil
}

//DeleteUserRestrictions deletes specific restrictions of a particular user
func (msq *MSSQLStore) DeleteUserRestriction(userID int64, restrToDelete InputRestriction) error {
	delq := `delete from UserRestriction 
	where UserID = @U_ID
	and RestrictionID = (select RestrictionID 
		from Restriction R
		join RestrictionType RT on R.RestrictionTypeID=RT.RestrictionTypeID
		where R.RestrictionName = @R_N
		and RT.RestrictionTypeName = @RT_N)`
	_, err := msq.db.ExecContext(context.Background(), delq, sql.Named("U_ID", userID),
		sql.Named("R_N", restrToDelete.RestrictName), sql.Named("RT_N", restrToDelete.RestrictType))
	if err != nil {
		return err
	}
	return nil
}
