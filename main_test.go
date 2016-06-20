package main

import (
	"testing"
	"github.com/mattbaird/elastigo/lib"
)

func TestSaveTop(t *testing.T) {
	c := elastigo.NewConn()
	// Set the Elasticsearch Host to Connect to
	c.Domain = "localhost"
	c.Port   = "9200"
	SaveTop(c)
}