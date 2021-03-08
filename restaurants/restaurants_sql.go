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

//MenuItem represents an item on the restaurant's menu
type MenuItem struct {
	Name        string   `json:"name"`
	Descr       string   `json:"descr"`
	Ingredients []string `json:"ingredients"`
	Calories    int      `json:"calories"`
	Textures    []string `json:"textures"`
	Diets       []string `json:"diets"`
	Img         string   `json:"img"`
}

//MenuCategory represents a meal category with an array of MenuItems
type MenuCategory struct {
	Category string      `json:"category"`
	Items    []*MenuItem `json:"items"`
}

//Menu represents a restaurant's menu on the website
type Menu struct {
	MenuList []*MenuCategory `json:"menulist"`
}

//Restaurant represents a restaurant on the website
type Restaurant struct {
	ID      int64  `json:"id"`
	Name    string `json:"name"`
	Address string `json:"address"`
	City    string `json:"city"`
	State   string `json:"state"`
	Zip     int    `json:"zip"`
	Img     string `json:"img"`
	Menu    *Menu  `json:"menu"`
}

//Ingredient represents an Ingredient in a Meal
type Ingredient struct {
	ID               int64  `json:"id"`
	Name             string `json:"name"`
	Descr            string `json:"descr"`
	IngredientTypeID int64  `json:"ingredienttypeid"`
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
	Calories     int    `json:"calories"`
	Img          string `json:"img"`
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
			&thisRestaurant.State, &thisRestaurant.Zip, &thisRestaurant.Img); err != nil {
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

//GetAllRestaurants returns all restaurants within the given zipcode
func (store SQLStore) GetAllRestaurants() ([]Restaurant, error) {
	var output []Restaurant
	inq := "select * from Restaurants"
	rows, err := store.db.QueryContext(context.Background(), inq)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var thisRestaurant Restaurant
		if err := rows.Scan(&thisRestaurant.ID, &thisRestaurant.Name, &thisRestaurant.Address,
			&thisRestaurant.State, &thisRestaurant.Zip, &thisRestaurant.Img); err != nil {
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
func (store SQLStore) GetRestaurantByName(restName string) ([]*Restaurant, error) {
	var output []*Restaurant
	inq := "select * from Restaurants where RestaurantName=?"
	rows, err := store.db.QueryContext(context.Background(), inq, restName)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var thisRestaurant *Restaurant
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

//GetRestaurantByID returns all restaurants with given name
// **NOTE: may rewrite so it only returns one row
func (store SQLStore) GetRestaurantByID(restID int64) ([]Restaurant, error) {
	var output []Restaurant
	inq := "select * from Restaurants where RestaurantID=?"
	rows, err := store.db.QueryContext(context.Background(), inq, restID)
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
		//GetRestaurantMenu
		output = append(output, thisRestaurant)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return output, nil
}

//GetRestaurantMenu returns a Menu struct with all the meals a restaurant offers by category
func (store SQLStore) GetRestaurantMenu(restID int64) (*Menu, error) {
	//Create Menu struct
	//execute MenuCategories
	//execute MenuItem
	//organize and return output
	var output *Menu
	menuMap, err := store.GetMenuItems(restID)
	if err != nil {
		return nil, err
	}
	mapKeys := make([]string, 0, len(menuMap))
	for k := range menuMap {
		mapKeys = append(mapKeys, k)
	}
	for _, k := range mapKeys {
		categPart := &MenuCategory{k, menuMap[k]}
		output.MenuList = append(output.MenuList, categPart)
	}
	return output, nil
}

//GetMenuCategories

//GetMenuItems -- return map here
func (store SQLStore) GetMenuItems(restID int64) (map[string][]*MenuItem, error) {
	var output map[string][]*MenuItem
	Meals, err := store.GetRestaurantMeals(restID)
	if err != nil {
		return nil, err
	}
	//get meal category, convert meal to menuitem
	for _, meal := range Meals {
		categName, err := store.GetMealType(meal.ID)
		if err != nil {
			return nil, err
		}
		if output[categName] == nil {
			output[categName] = []*MenuItem{}
		}
		mealItem, err := store.MealtoMenuItem(meal)
		if err != nil {
			return nil, err
		}
		output[categName] = append(output[categName], mealItem)
	}
	return output, nil
}

//MealtoMenuItem
func (store SQLStore) MealtoMenuItem(baseMeal Meal) (*MenuItem, error) {
	var output *MenuItem
	var subErr error
	output.Name, output.Descr, output.Calories, output.Img = baseMeal.Name, baseMeal.Descr, baseMeal.Calories, baseMeal.Img
	output.Ingredients, subErr = store.GetMealIngredients(baseMeal.ID)
	if subErr != nil {
		return nil, subErr
	}
	output.Textures, subErr = store.GetMealTextures(baseMeal.ID)
	if subErr != nil {
		return nil, subErr
	}
	output.Diets, subErr = store.GetMealDiet(baseMeal.ID)
	if subErr != nil {
		return nil, subErr
	}
	return output, nil
}

//GetMealIngredients
func (store SQLStore) GetMealIngredients(mealID int64) ([]string, error) {
	var output []string
	ingredInq := `select I.IngredientName 
	from Ingredients I
	join MealIngredient MI on MI.IngredientID=I.IngredientID 
	join Meal M on M.MealID=MI.MealID 
	where MealID=?`
	rows, err := store.db.QueryContext(context.Background(), ingredInq, mealID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var ingredient string
		if err := rows.Scan(&ingredient); err != nil {
			return nil, err
		}
		output = append(output, ingredient)
	}
	return output, nil
}

//GetMealDiet
func (store SQLStore) GetMealDiet(mealID int64) ([]string, error) {
	var output []string
	dietInq := `select R.RestrictionName
	from Restriction R
	join IngredientRestriction IR on IR.RestrictionID=R.RestrictionID 
	join Ingredient I on I.IngredientID=IR.IngredientID
	join MealIngredient MI on MI.IngredientID=I.IngredientID 
	join Meal M on M.MealID=MI.MealID 
	where MealID=?`
	rows, err := store.db.QueryContext(context.Background(), dietInq, mealID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var diet string
		if err := rows.Scan(&diet); err != nil {
			return nil, err
		}
		output = append(output, diet)
	}
	return output, nil
}

//GetMealTextures
func (store SQLStore) GetMealTextures(mealID int64) ([]string, error) {
	var output []string
	textInq := `select T.TextureName 
	from Texture T
	join MealTexture MTE on MTE.TextureID=T.TextureID 
	join Meal M on M.MealID=MTE.MealID 
	where MealID=?`
	rows, err := store.db.QueryContext(context.Background(), textInq, mealID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var texture string
		if err := rows.Scan(&texture); err != nil {
			return nil, err
		}
		output = append(output, texture)
	}
	return output, nil
}

//GetMealType
func (store SQLStore) GetMealType(mealID int64) (string, error) {
	var output string
	mealTypeInq := `select MT.MealTypeName
	from MealType MT
	join Meal M on M.MealTypeID=MT.MealTypeID
	where MealID=?`
	row := store.db.QueryRowContext(context.Background(), mealTypeInq, mealID)
	if err := row.Scan(&output); err != nil {
		return output, err
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
		if err := rows.Scan(&thisMeal.ID, &thisMeal.Name, &thisMeal.Descr, &thisMeal.Calories,
			&thisMeal.RestaurantID, &thisMeal.MealTypeID); err != nil {
			return nil, err
		}
		output = append(output, thisMeal)
	}
	if rows.Err(); err != nil {
		return nil, err
	}
	return output, nil
}
