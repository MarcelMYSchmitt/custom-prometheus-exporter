package main

import (
	"fmt"
	"net/http"
	"log"
	"os"
	"io/ioutil"
	"encoding/json"
	"github.com/prometheus/client_golang/prometheus"
)


var URL = "SHOULD_NOT_BE_EMPTY"
var CLIENTID = "SHOULD_NOT_BE_EMPTY"
var CLIENTPASSWORD = "SHOULD_NOT_BE_EMPTY"
var ENDPOINT_AVAILABILITY = prometheus.NewGauge(prometheus.GaugeOpts{
	Name: "ENDPOINT_AVAILABILITY", Help: "Shows Availability of Endpoint."})



func init() {

	if URL_env := os.Getenv("URL"); URL_env != "" {
		URL = URL_env
	}

	if clientid_env := os.Getenv("CLIENTID"); clientid_env != "" {
		CLIENTID = clientid_env
	}

    if clientpassword_env := os.Getenv("CLIENTPASSWORD"); clientpassword_env != "" {
		CLIENTPASSWORD = clientpassword_env
	}

	prometheus.MustRegister(ENDPOINT_AVAILABILITY)	
}


type Response struct {
	AccessToken string `json:"access_token"`
	TokenType string `json:"token_type"`
	ExpiresIn int `json:"expires_in"`
}


func CallEndpoint() Response {
    client := &http.Client{}
    req, err := http.NewRequest("POST", URL, nil)
    req.SetBasicAuth(CLIENTID, CLIENTPASSWORD)

	fmt.Println("Calling Endpoint: ", URL)
	resp, err := client.Do(req)

    if err != nil{
        log.Fatal(err)
	}
	
	fmt.Println("Read and parse response...")

	bodyText, err := ioutil.ReadAll(resp.Body)
	s := string(bodyText)

	fmt.Println("Unparsed response:", s)
	
	var response Response
	json.Unmarshal([]byte(s), &response)
	fmt.Println("AccessToken:", response.AccessToken)
	fmt.Println("TokenType:", response.TokenType)
	fmt.Println("ExpiresIn:", response.ExpiresIn)

	return response
}

func SetMetric(response Response) {
    if (response.AccessToken != "" && response.TokenType !="" && response.ExpiresIn != 0) {
		ENDPOINT_AVAILABILITY.Set(1)

		fmt.Println("Set Avaibility to 1")

	} else {
		ENDPOINT_AVAILABILITY.Set(0)

		fmt.Println("Set Avaibility to 0 and exited exporter...")

		os.Exit(0)
	}
}