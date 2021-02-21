package handlers

import (
	"net/http"
)

// ResponseHeader stores the handler that is passed in
type ResponseHeader struct {
	handler http.Handler
}

//NewResponseHeader constructs a new ResponseHeader middleware handler
func NewResponseHeader(handlerToWrap http.Handler) *ResponseHeader {
	return &ResponseHeader{handlerToWrap}
}

func (rh *ResponseHeader) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Expose-Headers", "Authorization")
	w.Header().Set("Access-Control-Max-Age", "600")
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	rh.handler.ServeHTTP(w, r)
}
