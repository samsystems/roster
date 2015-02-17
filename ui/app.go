package ui

import (
	app "github.com/sam/roster"

	"github.com/gorilla/mux"
	"net/http"
)

func init() {
	router := mux.NewRouter()
	app.RegisterHandlers(router)
	http.Handle("/", router)
}
