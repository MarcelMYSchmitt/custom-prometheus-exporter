package com.schmitt.prometheus.clients;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


@Service
public class CustomExporterClient {

	private final RestTemplate restTemplate;

	public CustomExporterClient(RestTemplateBuilder restTemplateBuilder) {
		this.restTemplate = restTemplateBuilder.build();
	}

	public ResponseEntity<String> callEndpoint(String url, String clientId, String clientPassword) {

		try {
			
			HttpHeaders headers = new HttpHeaders();
			headers.setBasicAuth(clientId, clientPassword);
			HttpEntity request = new HttpEntity(headers);		

			ResponseEntity<String> entity = restTemplate.postForEntity(url, request, String.class); 
			return entity;

		} catch (Exception ex) {

    		System.out.println("Endpoint: " + url + " was called.");
			System.out.print("Error message: " + ex);
		}
		return null;
	}

}