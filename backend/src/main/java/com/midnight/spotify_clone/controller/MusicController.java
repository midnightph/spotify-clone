package com.midnight.spotify_clone.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.midnight.spotify_clone.service.AuthService;
import com.midnight.spotify_clone.service.SpotifyClient;

@RestController
public class MusicController {
 
    private final SpotifyClient spotifyClient;
    private final AuthService authService;
    public MusicController(SpotifyClient spotifyClient, AuthService authService) {
        this.spotifyClient = spotifyClient;
        this.authService = authService;
    }

    @GetMapping("/playlist")
    public String music(@RequestParam String userId) throws Exception {
        String accessToken = authService.getUser(userId).getAccessToken();
        String url = "https://api.spotify.com/v1/me/playlists?limit=50&offset=0";
        return spotifyClient.get(accessToken, url).toString();
    }

}
