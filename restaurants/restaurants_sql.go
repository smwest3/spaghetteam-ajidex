package restaurants

import (
	"context"
	"database/sql"
	"time"

	//importing the MSSQL driver without creating a local name for the package in our code
	_ "github.com/denisenkom/go-mssqldb"
)

//SQLStore holds mssql db
type SQLStore struct {
	db     *sql.DB
	sqlctx context.Context
}

//NewSQLStore creates and returns a new SQLStore
func NewSQLStore(db *sql.DB) SQLStore {
	sqlctx, cancel := context.WithTimeout(context.Background(), 300*time.Second)
	defer cancel()

	return SQLStore{db, sqlctx}
}

/*
STILL NEED TO ADD:
-Update structs for meals/restaurants(?)
*/

//Restaurant represents a restaurant on the website
type Restaurant struct {
	ID      int64  `json:"id"`
	Name    string `json:"name"`
	Address string `json:"address"`
	City    string `json:"city"`
	State   string `json:"state"`
	Zip     int    `json:"zip"`
}

//NewRestaurant represents a restaurant about to be submitted on the website
type NewRestaurant struct {
	Name    string `json:"name"`
	Address string `json:"address"`
	City    string `json:"city"`
	State   string `json:"state"`
	Zip     int    `json:"zip"`
}

//NewMeal represents a meal about to be submitted
type NewMeal struct {
	Name           string   `json:"name"`
	Descr          string   `json:"descr"`
	RestaurantName string   `json:"restaurantname"`
	MealType       string   `json:"mealtype"`
	Ingredients    []string `json:"ingredients"`
	Textures       []string `json:"textures"`
}

//Meal represents a meal from a restaurant on the website
type Meal struct {
	ID           int64  `json:"id"`
	Name         string `json:"name"`
	Descr        string `json:"descr"`
	RestaurantID int64  `json:"restaurantid"`
	MealTypeID   int64  `json:"mealtypeid"`
}

//GetNearbyRestaurants returns all restaurants within the given zipcode
func (store SQLStore) GetNearbyRestaurants(zipcode int64) ([]Restaurant, error) {
	var output []Restaurant
	inq := "select * from Restaurants where RestaurantZip=?"
	rows, err := store.db.QueryContext(context.Background(), inq, zipcode)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var thisRestaurant Restaurant
		if err := rows.Scan(&thisRestaurant.ID, &thisRestaurant.Name, &thisRestaurant.Address,
			&thisRestaurant.State, &thisRestaurant.Zip); err != nil {
			return nil, err
		}
		//future consideration: GIS capabilities
		output = append(output, thisRestaurant)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return output, nil
}

//GetRestaurantByName returns all restaurants with given name
// **NOTE: may rewrite so it only returns one row
func (store SQLStore) GetRestaurantByName(restName string) ([]Restaurant, error) {
	var output []Restaurant
	inq := "select * from Restaurants where RestaurantName=?"
	rows, err := store.db.QueryContext(context.Background(), inq, restName)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var thisRestaurant Restaurant
		if err := rows.Scan(&thisRestaurant.ID, &thisRestaurant.Name, &thisRestaurant.Address,
			&thisRestaurant.State, &thisRestaurant.Zip); err != nil {
			return nil, err
		}
		//future consideration: GIS capabilities
		output = append(output, thisRestaurant)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return output, nil
}

//GetRestaurantMeals returns all the meals a restaurant with the given ID offers
func (store SQLStore) GetRestaurantMeals(restID int64) ([]Meal, error) {
	var output []Meal
	inq := "select * from Meals where RestaurantID=?"
	rows, err := store.db.QueryContext(context.Background(), inq, restID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var thisMeal Meal
		if err := rows.Scan(&thisMeal.ID, &thisMeal.Name, &thisMeal.Descr, &thisMeal.RestaurantID,
			&thisMeal.MealTypeID); err != nil {
			return nil, err
		}
		output = append(output, thisMeal)
	}
	if rows.Err(); err != nil {
		return nil, err
	}
	return output, nil
}
