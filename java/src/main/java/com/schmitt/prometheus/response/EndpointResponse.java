package com.schmitt.prometheus.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EndpointResponse {

	@JsonProperty("access_token")
    private String accessToken;
	
	@JsonProperty("token_type")
    private String tokenType;
	
	@JsonProperty("expires_in")
	private int expiresIn;

	public String getAccessToken() {
		return accessToken; 
	}

	public String getTokenType() {
		return tokenType; 
	}

	public int getExpiresIn() {
		return expiresIn; 
	}
}