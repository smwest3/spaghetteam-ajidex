package main

import "database/sql"

//HandlerContext has Session signingkey, a sessionstore, and a userstore
type HandlerContext struct {
	Store SQLStore
}

//NewHandlerContext creates and returns a HandlerContext struct with the inputted values
func NewHandlerContext(inputStore *sql.DB) *HandlerContext {
	handlerContext := &HandlerContext{}
	handlerContext.Store = NewSQLStore(inputStore)
	return handlerContext
}
