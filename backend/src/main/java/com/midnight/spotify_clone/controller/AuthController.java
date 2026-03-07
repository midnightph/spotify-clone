package com.midnight.spotify_clone.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.midnight.spotify_clone.config.SpotifyConfig;

@RestController
public class AuthController {

    @GetMapping("/test")
    public String test() {
        return "API funcionando!";
    }

    private final SpotifyConfig spotifyConfig;

    public AuthController(SpotifyConfig spotifyConfig) {
        this.spotifyConfig = spotifyConfig;
    }

    @GetMapping("/login")
    public String login() {
        String authUrl = "https://accounts.spotify.com/authorize" +
                "?client_id=" + spotifyConfig.clientId +
                "&response_type=code" +
                "&redirect_uri=" + spotifyConfig.redirectUri +
                "&scope=user-read-private user-read-email";
        return "Redirecionar para: " + authUrl;
    }

    @GetMapping("/callback")
    public String callback(String code) {
        // Aqui você receberia o código de autorização e trocaria por um token de acesso
        return "Código recebido: " + code;
    }

}
