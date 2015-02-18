package handler

import (
	"appengine"
	"encoding/json"
	"github.com/gorilla/mux"
	"net/http"
)

type Error struct {
	Error   error
	Message string
	Code    int
}

type ctxGetter func(r *http.Request) appengine.Context
type handlerFun func(c appengine.Context, w http.ResponseWriter, r *http.Request, v map[string]string) (interface{}, *Error)

type handler struct {
	handlerFun    handlerFun
	contextGetter ctxGetter
}

func New(hf handlerFun) http.Handler {
	return handler{hf, ctxGetter(func(r *http.Request) appengine.Context {
		return appengine.NewContext(r)
	})}
}

func WithContext(hf handlerFun, cg ctxGetter) http.Handler {
	return handler{hf, cg}
}

// Handler implements the http.Handler interface
func (h handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	c := h.contextGetter(r)

	response, err := h.handlerFun(c, w, r, mux.Vars(r))

	if err != nil {
		c.Errorf("%v", err.Error)
		http.Error(w, err.Message, err.Code)
		return
	}
	if response == nil {
		return
	}

	bytes, e := json.Marshal(response)
	if e != nil {
		http.Error(w, "Error marshalling JSON", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(bytes)
}
