package middleware

import (
	"net/http"
)

type SingleHost struct {
	handler     http.Handler
	allowedHost string
}

func NewSingleHost(handler http.Handler, allowedHost string) *SingleHost {
	return &SingleHost{handler: handler, allowedHost: allowedHost}
}

func (s *SingleHost) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	host := r.Host
	if host == s.allowedHost {
		s.handler.ServeHTTP(w, r)
	} else {
		w.WriteHeader(403)
	}
}

func myHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Success!"))
}
