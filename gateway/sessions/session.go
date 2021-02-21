package sessions

import (
	"errors"
	"net/http"
	"strings"
)

const headerAuthorization = "Authorization"
const paramAuthorization = "auth"
const schemeBearer = "Bearer "

//ErrNoSessionID is used when no session ID was found in the Authorization header
var ErrNoSessionID = errors.New("no session ID found in " + headerAuthorization + " header")

//ErrInvalidScheme is used when the authorization scheme is not supported
var ErrInvalidScheme = errors.New("authorization scheme not supported")

//BeginSession creates a new SessionID, saves the `sessionState` to the store, adds an
//Authorization header to the response with the SessionID, and returns the new SessionID
func BeginSession(signingKey string, store Store, sessionState interface{}, w http.ResponseWriter) (SessionID, error) {
	sesID, err := NewSessionID(signingKey)
	if err != nil {
		return InvalidSessionID, err
	}
	errTwo := store.Save(sesID, sessionState)
	if errTwo != nil {
		return InvalidSessionID, errTwo
	}
	str := schemeBearer + sesID.String()
	w.Header().Add(headerAuthorization, str)

	return sesID, nil
}

//GetSessionID extracts and validates the SessionID from the request headers
func GetSessionID(r *http.Request, signingKey string) (SessionID, error) {
	val := r.Header.Get(headerAuthorization)
	if val == "" {
		val = r.URL.Query().Get("auth")
	}

	if strings.Contains(val, schemeBearer) {
		val = strings.ReplaceAll(val, schemeBearer, "")
	} else {
		return InvalidSessionID, ErrInvalidScheme
	}

	sesID, err := ValidateID(val, signingKey)
	if err != nil {
		return InvalidSessionID, err
	}
	return sesID, nil
}

//GetState extracts the SessionID from the request,
//gets the associated state from the provided store into
//the `sessionState` parameter, and returns the SessionID
func GetState(r *http.Request, signingKey string, store Store, sessionState interface{}) (SessionID, error) {
	sesID, err := GetSessionID(r, signingKey)
	if err != nil {
		return InvalidSessionID, err
	}
	errTwo := store.Get(sesID, sessionState)
	if errTwo != nil {
		return InvalidSessionID, ErrStateNotFound
	}
	return sesID, nil
}

//EndSession extracts the SessionID from the request,
//and deletes the associated data in the provided store, returning
//the extracted SessionID.
func EndSession(r *http.Request, signingKey string, store Store) (SessionID, error) {
	sesID, err := GetSessionID(r, signingKey)
	if err != nil {
		return InvalidSessionID, err
	}
	errTwo := store.Delete(sesID)
	if errTwo != nil {
		return InvalidSessionID, ErrStateNotFound
	}
	return sesID, nil
}
