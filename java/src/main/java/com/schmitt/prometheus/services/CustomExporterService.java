package com.schmitt.prometheus.services;

import java.util.Collections;
import java.util.Map;

import org.springframework.boot.json.JsonParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.schmitt.prometheus.clients.CustomExporterClient;
import com.schmitt.prometheus.meterbinder.CustomExporterStatsProbe;
import com.schmitt.prometheus.response.EndpointResponse;

@Component
public class CustomExporterService {

	@Value("${URL}")
	private String url;

	@Value("${CLIENTID}")
	private String clientId;

	@Value("${CLIENTPASSWORD}")
	private String clientPassword;

	private CustomExporterStatsProbe customExporterStatsProbe;

	@Autowired
	private CustomExporterClient customExporterClient;

	public CustomExporterService(CustomExporterStatsProbe customExporterStatsProbe,
			CustomExporterClient customExporterClient) {
		this.customExporterStatsProbe = customExporterStatsProbe;
		this.customExporterClient = customExporterClient;
	}

	/*
	 * 
	 * Call endpoint and set availability status depending on receiving response
	 * body and status code. Repeat every 10 seconds.
	 * 
	 */
	@Scheduled(fixedRate = 10000)
	public void setEndpointAvailability() throws JsonMappingException, JsonProcessingException {

		ResponseEntity<String> responseEntity = customExporterClient.callEndpoint(url,clientId, clientPassword);

		if (responseEntity == null) {
			customExporterStatsProbe.setEndpointAvailability(0);

			System.out.println("Could not call endpoint: " + url + " successfully.");
		} else {
			String responseEntityBody = responseEntity.getBody();

			EndpointResponse responseEntityBodyObject = new ObjectMapper().readValue(responseEntityBody, EndpointResponse.class);
			String accessToken = responseEntityBodyObject.getAccessToken();
			String tokenType = responseEntityBodyObject.getTokenType();
			int expiresIn = responseEntityBodyObject.getExpiresIn();

			if (accessToken != null && !accessToken.trim().isEmpty() && tokenType != null && !tokenType.trim().isEmpty()
					&& expiresIn != 0) {
				customExporterStatsProbe.setEndpointAvailability(1);
			} else {
				customExporterStatsProbe.setEndpointAvailability(0);
			}

			System.out.println("Endpoint status: " + customExporterStatsProbe.getEndpointAvailability());
		}

	}
}
