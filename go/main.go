package main

import (
	"net/http"
	"fmt"
	"time"
	"github.com/prometheus/client_golang/prometheus/promhttp"
  )
  
func main() {
	
	go func() {
   
		for {
			var callEndpointResponse = CallEndpoint()
			SetMetric(callEndpointResponse)

			fmt.Println("Sleeping 10 seconds...")
		
			time.Sleep(30 * time.Second)
        }
	}()

    http.Handle("/metrics", promhttp.Handler())
	
	fmt.Println("Beginning to serve on port :8080")
	http.ListenAndServe(":8080", nil)
	
}


