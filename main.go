package main

import (
    "github.com/codegangsta/negroni"
    "github.com/stretchr/graceful"
    "github.com/gorilla/mux"
    "github.com/unrolled/render"
    "github.com/mattbaird/elastigo/lib"

    "time"
    "flag"
    "net/http"

    //"streams/twitch"
    //"encoding/json"
    //"log"
)

var c *elastigo.Conn
var r *render.Render
var serverAddress string

type DateTop struct {
    //twitch.Top
    Date time.Time
}

func init() {
    r = render.New(render.Options{
        Extensions: []string{".tmpl", ".html"}, // Specify extensions to load for templates.
        IsDevelopment: true, // Render will now recompile the templates on every HTML response.
    })
}

func Index(res http.ResponseWriter, req *http.Request) {
    r.HTML(res, http.StatusOK, "index", nil)
}

//func SaveTop(c *elastigo.Conn) {
//    url := "https://api.twitch.tv/kraken/games/top?limit=100&offset=0"
//    response, err := http.Get(url)
//    if err != nil {
//        log.Println(err)
//        return
//    }
//    defer response.Body.Close()
//
//    decoder := json.NewDecoder(response.Body)
//    top_response := twitch.TopResponse{}
//    err = decoder.Decode(&top_response)
//    if err != nil {
//        log.Println(err)
//        return
//    }
//    for _, top := range top_response.Top {
//        index := "top_" + time.Now().Format("2006-01")
//        date_top := DateTop{top, time.Now()}
//        _, err := c.Index(index, "top", "", nil, date_top)
//        log.Println(date_top)
//        if err != nil {
//            log.Println(err)
//            return
//        }
//    }
//}

func main() {
    flag.StringVar(&serverAddress, "a", "0.0.0.0:8000", "Server address: host:port")
    flag.Parse()

    router := mux.NewRouter()
    router.NotFoundHandler = http.HandlerFunc(Index)

    n := negroni.Classic()
    n.UseHandler(router)
    graceful.Run(serverAddress, 30*time.Second, n)
}