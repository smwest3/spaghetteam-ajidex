package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"spaghetteam-ajidex/gateway/handlers"
	"spaghetteam-ajidex/gateway/models/users"
	"spaghetteam-ajidex/gateway/sessions"
	"strings"
	"sync/atomic"

	"github.com/go-redis/redis"
	"github.com/patrickmn/go-cache"
)

/*
Save for later
currSession := &handlers.SessionState{}
		_, err := sessions.GetState(r, c.Key, c.SessionStore, currSession)
		if err == nil {
			currID := currSession.User.ID
			user, _ := c.UserStore.GetByID(currID)
			encodedUser, _ := json.Marshal(user)
			r.Header.Add("X-User", string(encodedUser))
		} else {
			r.Header.Set("X-User", "")
		}
*/

// Director directs HTTPS to HTTP
type Director func(r *http.Request)

// CustomDirector creates a custom director
func CustomDirector(c *handlers.HandlerContext, targets []*url.URL) Director {
	var counter int32
	counter = 0
	return func(r *http.Request) {
		targ := targets[int(counter)%len(targets)]
		atomic.AddInt32(&counter, 1)
		r.Header.Add("X-Forwarded-Host", r.Host)
		r.Host = targ.Host
		r.URL.Host = targ.Host
		r.URL.Scheme = targ.Scheme
	}
}

func main() {
	addr := os.Getenv("ADDR")
	if len(addr) == 0 {
		addr = ":5000"
	}

	tlsCertPath := os.Getenv("TLSCERT")
	tlsKeyPath := os.Getenv("TLSKEY")
	key := os.Getenv("SESSIONKEY")
	redisAddr := os.Getenv("REDISADDR")
	dsn := os.Getenv("DSN")

	rdb := redis.NewClient(&redis.Options{
		Addr: redisAddr,
	})

	rStore := sessions.NewRedisStore(rdb, cache.DefaultExpiration)

	var db *sql.DB
	var err error
	db, err = sql.Open("sqlserver", dsn)
	if err != nil {
		fmt.Printf("error opening database: %v\n", err)
		os.Exit(1)
	}
	defer db.Close()

	handlerctx := &handlers.HandlerContext{
		Key:          key,
		SessionStore: rStore,
		UserStore:    users.NewMSSQLStore(db),
	}

	restaurantAddresses := strings.Split(os.Getenv("RESTAURANTADDR"), ",")

	var restaurantURLS []*url.URL

	for _, v := range restaurantAddresses {
		restaurantURLS = append(restaurantURLS, &url.URL{Scheme: "http", Host: v})
	}

	restaurantProxy := &httputil.ReverseProxy{Director: CustomDirector(handlerctx, restaurantURLS)}

	if len(tlsCertPath) == 0 || len(tlsKeyPath) == 0 {
		os.Stdout.Write([]byte("Environment variables are not set"))
		os.Exit(1)
	}

	mux := http.NewServeMux()

	mux.Handle("/restaurants", restaurantProxy)
	mux.Handle("/restaurants/", restaurantProxy)
	mux.HandleFunc("/profile", handlerctx.UsersHandler)
	mux.HandleFunc("/profile/", handlerctx.SpecificUserHandler)
	mux.HandleFunc("/sessions", handlerctx.SessionsHandler)
	mux.HandleFunc("/sessions/", handlerctx.SpecificSessionHandler)
	wrappedMux := handlers.NewResponseHeader(mux)

	log.Printf("server is listening at %s...", addr)
	log.Fatal(http.ListenAndServeTLS(addr, tlsCertPath, tlsKeyPath, wrappedMux))
}
