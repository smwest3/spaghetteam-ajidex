package handlers

import (
	"spaghetteam-ajidex/gateway/models/users"
	"time"
)

// SessionState saves the state sessions for the web server
type SessionState struct {
	Time time.Time   `json:"time"`
	User *users.User `json:"user"`
}
