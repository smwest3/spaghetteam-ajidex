package handlers

import (
	"spaghetteam-ajidex/gateway/models/users"
	"spaghetteam-ajidex/gateway/sessions"
)

// HandlerContext provides the handlers with access to an initialized sessions.Store
// and users.Store, as well as the session signing key
type HandlerContext struct {
	Key          string
	SessionStore sessions.Store
	UserStore    users.Store
}
