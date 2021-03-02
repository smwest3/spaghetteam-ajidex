package restaurants

//HandlerContext has Session signingkey, a sessionstore, and a userstore
type HandlerContext struct {
	Store SQLStore
}

//NewHandlerContext creates and returns a HandlerContext struct with the inputted values
func NewHandlerContext(inputStore SQLStore) *HandlerContext {
	handlerContext := &HandlerContext{}
	handlerContext.Store = inputStore
	return handlerContext
}
