package com.midnight.spotify_clone.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.fasterxml.jackson.databind.JsonNode;
import com.midnight.spotify_clone.config.SpotifyConfig;
import com.midnight.spotify_clone.model.User;
import com.midnight.spotify_clone.service.AuthService;
import com.midnight.spotify_clone.service.SpotifyClient;

@RestController
public class AuthController {

    private final SpotifyConfig spotifyConfig;
    private final AuthService authService;
    private final SpotifyClient spotifyClient;

    public AuthController(SpotifyConfig spotifyConfig, AuthService authService, SpotifyClient spotifyClient) {
        this.spotifyConfig = spotifyConfig;
        this.authService = authService;
        this.spotifyClient = spotifyClient;
    }

    @GetMapping("/login")
    public RedirectView login() {
        String authUrl = "https://accounts.spotify.com/authorize" +
                "?client_id=" + spotifyConfig.clientId +
                "&response_type=code" +
                "&redirect_uri=" + spotifyConfig.redirectUri +
                "&scope=user-read-private user-read-email playlist-read-private playlist-read-collaborative";
        return new RedirectView(authUrl);
    }

    @GetMapping("/callback")
    public RedirectView callback(@RequestParam String code) {
        try {
            User user = authService.handleCallback(code);
            return new RedirectView("http://localhost:5173/?userId=" + user.getId());
        } catch (Exception e) {
            e.printStackTrace();
            return new RedirectView("http://localhost:5173/error");
        }
    }

    @GetMapping("/user")
    public User getUser(@RequestParam String userId) {
        return authService.getUser(userId);
    }

    @PostMapping("/auth/refresh")
    public Map<String, String> refresh(@RequestBody Map<String, String> body) {
        try {
            String refreshToken = body.get("refreshToken");
            JsonNode tokenData = spotifyClient.refreshToken(refreshToken); // usa o injetado
            String newAccessToken = tokenData.get("access_token").asText();
            return Map.of("accessToken", newAccessToken);
        } catch (Exception e) {
            throw new RuntimeException("Falha ao renovar token");
        }
    }
}