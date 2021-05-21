package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"spaghetteam-ajidex/gateway/models/users"
	"strings"
)

//UserDietHandler handles requests to profile/me/diet
func (ctx *HandlerContext) SpecificUserDietHandler(w http.ResponseWriter, r *http.Request) {
	if r.Header.Get("X-User") != "" {
		decoder := json.NewDecoder(strings.NewReader(r.Header.Get("X-User")))
		user := &users.User{}
		err := decoder.Decode(user)
		if err != nil {
			http.Error(w, "error decoding response body", http.StatusBadRequest)
			return
		}
		switch r.Method {
		case http.MethodGet:
			var dietList []*Restriction
			dietList, err = ctx.Store.GetUserRestrictions(user.ID)
			if err != nil {
				http.Error(w, fmt.Sprintf("Error retrieving restrictions: %v", err), http.StatusInternalServerError)
				return
			}
			w.Header().Add("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			if err := json.NewEncoder(w).Encode(dietList); err != nil {
				http.Error(w, fmt.Sprintf("Error encoding JSON: %v", err), http.StatusInternalServerError)
				return
			}
		case http.MethodPatch:
			var inputRestr []InputRestriction
			if err := json.NewDecoder(r.Body).Decode(inputRestr); err != nil {
				http.Error(w, "Error decoding diet JSON", http.StatusInternalServerError)
				return
			}
			if err := ctx.Store.EditUserRestriction(user.ID, inputRestr); err != nil {
				http.Error(w, fmt.Sprintf("Error occurred when editing restrictions: %v", err), http.StatusInternalServerError)
				return
			}
			updatedRestr, err := ctx.Store.GetUserRestrictions(user.ID)
			if err != nil {
				http.Error(w, fmt.Sprintf("Error retrieving restrictions: %v", err), http.StatusInternalServerError)
				return
			}
			w.WriteHeader(http.StatusOK)
			if err := json.NewEncoder(w).Encode(updatedRestr); err != nil {
				http.Error(w, fmt.Sprintf("Error encoding JSON: %v", err), http.StatusInternalServerError)
				return
			}
		default:
			http.Error(w, "Method not supported", http.StatusMethodNotAllowed)
			return
		}
	} else {
		http.Error(w, "User is not authenticated", http.StatusUnauthorized)
		return
	}
}
