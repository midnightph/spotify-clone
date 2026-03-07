package com.midnight.spotify_clone.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SpotifyConfig {

    @Value("${spotify.client-id}")
    public String clientId;

    @Value("${spotify.client-secret}")
    public String clientSecret;

    @Value("${spotify.redirect-uri}")
    public String redirectUri;

}