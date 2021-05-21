package main

import (
	"context"
	"database/sql"
	"errors"
	"strings"
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

type ReturnDiet struct {
	Allergens []string `json:"allergens"`
	Textures  []string `json:"textures"`
	Diets     []string `json:"diets"`
}

//InputRestriction represents a restriction to be added or deleted
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
func (msq *MSSQLStore) GetUserRestrictions(userID int64) (*ReturnDiet, error) {
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
	output, err := msq.ToReturnDiet(restrictions)
	if err != nil {
		return nil, err
	}
	return output, nil
}

func (msq *MSSQLStore) ToReturnDiet(toChange []*Restriction) (*ReturnDiet, error) {
	output := &ReturnDiet{}
	output.Allergens = make([]string, 0)
	output.Textures = make([]string, 0)
	output.Diets = make([]string, 0)
	for _, restriction := range toChange {
		restrictionType := restriction.RestrictType + "s"
		if restrictionType == "Allergens" {
			output.Allergens = append(output.Allergens, restriction.RestrictName)
		} else if restrictionType == "Textures" {
			output.Textures = append(output.Textures, restriction.RestrictName)
		} else if restrictionType == "Diets" {
			output.Diets = append(output.Diets, restriction.RestrictName)
		} else {
			return nil, errors.New("Invalid restriction type, action aborted")
		}
	}
	return output, nil
}

func (msq *MSSQLStore) EditUserRestriction(userID int64, inputRestr *InputRestriction) error {
	if strings.ToLower(inputRestr.ActionToDo) == "add" {
		if err := msq.InsertUserRestriction(userID, inputRestr); err != nil {
			return err
		}
	} else if strings.ToLower(inputRestr.ActionToDo) == "delete" {
		if err := msq.DeleteUserRestriction(userID, inputRestr); err != nil {
			return err
		}
	}
	return nil
}

func (msq *MSSQLStore) GetRestrictionID(restrName string, restrType string) (int64, error) {
	var restrID int64
	restrIDquery := `(select RestrictionID 
		from Restriction R
		join RestrictionType RT on R.RestrictionTypeID=RT.RestrictionTypeID
		where R.RestrictionName = @R_N
		and RT.RestrictionTypeName = @RT_N)`
	row := msq.db.QueryRowContext(context.Background(), restrIDquery, sql.Named("R_N", restrName),
		sql.Named("RT_N", restrType))
	if err := row.Scan(&restrID); err != nil {
		if err == sql.ErrNoRows {
			restrExec := `insert into Restriction(RestrictionName, RestrictionDescr, RestrictionTypeID)
			values (@RN, 'User inputted Restriction', 
				(select RestrictionTypeID from RestrictionType where RestrictionTypeName = @RT_N))
			select SCOPE_IDENTITY()`
			inputRow := msq.db.QueryRowContext(context.Background(), restrExec,
				sql.Named("RN", restrName), sql.Named("RT_N", restrType))
			if err := inputRow.Scan(&restrID); err != nil {
				return 0, err
			}
		} else {
			return 0, err
		}
	}
	return restrID, nil
}

//InsertUserRestrictions inserts the restrictions of a particular user
func (msq *MSSQLStore) InsertUserRestriction(userID int64, inputRestr *InputRestriction) error {
	restrID, err := msq.GetRestrictionID(inputRestr.RestrictName, inputRestr.RestrictType)
	if err != nil {
		return err
	}
	sqlExec := `insert into UserRestriction(UserID, RestrictionID)
	values (@U_ID, @R_ID)`
	_, err = msq.db.ExecContext(context.Background(), sqlExec,
		sql.Named("U_ID", userID), sql.Named("R_ID", restrID))
	if err != nil {
		return err
	}
	return nil
}

//DeleteUserRestrictions deletes specific restrictions of a particular user
func (msq *MSSQLStore) DeleteUserRestriction(userID int64, restrToDelete *InputRestriction) error {
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
