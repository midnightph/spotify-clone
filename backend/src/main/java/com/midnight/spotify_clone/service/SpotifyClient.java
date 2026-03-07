package com.midnight.spotify_clone.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.midnight.spotify_clone.config.SpotifyConfig;

@Service
public class SpotifyClient {

    private final SpotifyConfig spotifyConfig;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SpotifyClient(SpotifyConfig spotifyConfig) {
        this.spotifyConfig = spotifyConfig;
    }

    public JsonNode getToken(String code) throws Exception {
        URL url = new URL("https://accounts.spotify.com/api/token");
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        con.setDoOutput(true);

        String body = "grant_type=authorization_code"
                + "&code=" + code
                + "&redirect_uri=" + spotifyConfig.redirectUri
                + "&client_id=" + spotifyConfig.clientId
                + "&client_secret=" + spotifyConfig.clientSecret;

        try (OutputStream os = con.getOutputStream()) {
            os.write(body.getBytes("utf-8"));
        }

        return readResponse(con);
    }

    public JsonNode getUserProfile(String accessToken) throws Exception {
        URL url = new URL("https://api.spotify.com/v1/me");
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("GET");
        con.setRequestProperty("Authorization", "Bearer " + accessToken);
        return readResponse(con);
    }

    private JsonNode readResponse(HttpURLConnection con) throws Exception {
        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
        StringBuilder response = new StringBuilder();
        String line;
        while ((line = in.readLine()) != null) response.append(line);
        in.close();
        return objectMapper.readTree(response.toString());
    }
}