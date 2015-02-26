package main

import (
    "github.com/codegangsta/negroni"
    "github.com/stretchr/graceful"
    "github.com/gorilla/mux"
    "github.com/unrolled/render"

    "time"
    "flag"
    "net/http"
)

var r *render.Render
var serverAddress string

func init() {
    r = render.New()
}

func Index(res http.ResponseWriter, req *http.Request) {
    r.HTML(res, http.StatusOK, "index", nil)
}

func main() {
    flag.StringVar(&serverAddress, "a", "0.0.0.0:8000", "Server address: host:port")
    flag.Parse()

    router := mux.NewRouter()
    router.HandleFunc("/", Index).Methods("GET")

    n := negroni.Classic()
    n.UseHandler(router)
    graceful.Run(serverAddress, 30*time.Second, n)
}