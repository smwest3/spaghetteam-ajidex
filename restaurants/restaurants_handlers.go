package restaurants

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"path"
	"strconv"
)

//RestaurantHandler handles requests to the /restaurants endpoint
func (ctx *HandlerContext) RestaurantHandler(w http.ResponseWriter, r *http.Request) {
	//user sign in check goes here
	switch r.Method {
	case http.MethodGet:
		restaurantList, err := ctx.Store.GetAllRestaurants()
		if err != nil {
			http.Error(w, fmt.Sprintf("Error retrieving restaurants: %v", err), http.StatusInternalServerError)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(restaurantList); err != nil {
			http.Error(w, fmt.Sprintf("Error encoding JSON: %v", err), http.StatusInternalServerError)
			return
		}

	default:
		http.Error(w, "Method not supported", http.StatusMethodNotAllowed)
		return
	}
}

//SpecificRestaurantHandler handles requests to the /restaurants/ endpoint
func (ctx *HandlerContext) SpecificRestaurantHandler(w http.ResponseWriter, r *http.Request) {
	urlBase := path.Base(r.URL.String())
	idBase, _ := strconv.Atoi(urlBase)
	restID := int64(idBase)
	switch r.Method {
	case http.MethodGet:
		restaurantResult, err := ctx.Store.GetRestaurantByID(restID)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, fmt.Sprint("Restaurant not found"), http.StatusNotFound)
			} else {
				http.Error(w, fmt.Sprintf("Error retrieving restaurant: %v", err), http.StatusInternalServerError)
				return
			}
		}
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(restaurantResult); err != nil {
			http.Error(w, fmt.Sprintf("Error encoding JSON: %v", err), http.StatusInternalServerError)
			return
		}
	}
}
