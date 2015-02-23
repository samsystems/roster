package ui

import (
	app "github.com/samsystems/roster"

	"github.com/gorilla/mux"
	"net/http"
)

func init() {
	router := mux.NewRouter()
	app.RegisterHandlers(router)
	http.Handle("/", router)
}
