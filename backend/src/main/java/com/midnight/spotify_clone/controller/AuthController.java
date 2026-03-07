package com.midnight.spotify_clone.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.midnight.spotify_clone.config.SpotifyConfig;
import com.midnight.spotify_clone.model.User;
import com.midnight.spotify_clone.service.AuthService;

@RestController
public class AuthController {

    private final SpotifyConfig spotifyConfig;
    private final AuthService authService;

    public AuthController(SpotifyConfig spotifyConfig, AuthService authService) {
        this.spotifyConfig = spotifyConfig;
        this.authService = authService;
    }

    @GetMapping("/login")
    public RedirectView login() {
        String authUrl = "https://accounts.spotify.com/authorize" +
                "?client_id=" + spotifyConfig.clientId +
                "&response_type=code" +
                "&redirect_uri=" + spotifyConfig.redirectUri +
                "&scope=user-read-private user-read-email";
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
}