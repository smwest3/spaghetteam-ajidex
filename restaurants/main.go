package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	addr := os.Getenv("ADDR")
	if len(addr) == 0 {
		addr = ":5300"
	}

	dsn := os.Getenv("DSN")
	var db *sql.DB
	var err error
	db, err = sql.Open("sqlserver", dsn)
	if err != nil {
		fmt.Printf("error opening database: %v\n", err)
		os.Exit(1)
	}
	if err := db.Ping(); err != nil {
		log.Fatalln(err)
	}
	defer db.Close()
	ctx := NewHandlerContext(db)
	mux := http.NewServeMux()
	mux.HandleFunc("/restaurants", ctx.RestaurantHandler)
	mux.HandleFunc("/restaurants/", ctx.SpecificRestaurantHandler)
	log.Printf("Server is listening at %s...\n", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}
