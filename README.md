# Introduction

This repository contains a custom prometheus exporter in different programming languages.

Functionality of prometheus exporter is quite simple: Just ask an endpoint with Basic Authentication for Credentials. If we get a response with a token, everything is fine and Metric `ENDPOINT_AVAILABILITY` will be 1, if not Metric `ENDPOINT_AVAILABILITY` will be 0 and we have to take a look. There is a sleep timer (10 seconds) and a for/while loop implemented so we call the endpoint cyclically.  

## Purpose of this repository 

When you run your exporters on premise or in your cloud you always have to consider the ressources you need -> CPU and Memory. In your own cloud it could be the more expensive the more exporter you have, so it may be good to consider in which language you write your exporters because not every language needs the same ressources. Here you have always the same exporter with the same functionality in the subfolders, so try out and take a look when into the `docker stats` for getting a feeling about the ressources you need.   


## Purpose of exporter 

Why do we need such exporter?   
We want to make sure that some endpoints we call are available all the time. If we need for example an interface which we call for retrieving an access token (like an authority provider) than we have to make sure that not just our acceptance / component tests in our CI/CD pipelines make sure that everything works...no we have to see in real time (on DEV / INT / PROD environment) if the specific endpoints are available or not to react immediately. 


---

## How to run

We can use the docker-compose file for running the specific exporter. Before using the file we need an `.env` file in which we store our variables: URL, CLIENTID, CLIENTPASSWORD. It's not checked in so make you create it manually before running docker-compose.

Content of the `.env` file: 

```
URL=*url_to_call*
CLIENTID=*client_id*
CLIENTPASSWORD=*client_secret*
```

For using the prometheus exporter in go just run: `docker-compose up custom-prometheus-exporter-go`.  
If you make a change in code use the `--build` parameter: `docker-compose up --build custom-prometheus-exporter-go`.

---

## Programming languages

- c#
- java
- go
- powershell 
- php
- nodejs

## To DO
Extend Readme and add more exporter (deno still open).
