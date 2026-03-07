package com.midnight.spotify_clone.service;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.midnight.spotify_clone.model.User;
import com.midnight.spotify_clone.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final SpotifyClient spotifyClient;

    public AuthService(UserRepository userRepository, SpotifyClient spotifyClient) {
        this.userRepository = userRepository;
        this.spotifyClient = spotifyClient;
    }

    public User handleCallback(String code) throws Exception {
        JsonNode tokenData = spotifyClient.getToken(code);
        JsonNode userData  = spotifyClient.getUserProfile(tokenData.get("access_token").asText());

        String spotifyId = userData.get("id").asText();

        User user = userRepository.findById(spotifyId).orElse(new User());
        user.setId(spotifyId);
        user.setName(userData.get("display_name").asText());
        user.setEmail(userData.get("email").asText());
        user.setAccessToken(tokenData.get("access_token").asText());
        user.setRefreshToken(tokenData.get("refresh_token").asText());
        user.setTokenExpiresAt(System.currentTimeMillis() + (tokenData.get("expires_in").asLong() * 1000));

        return userRepository.save(user);
    }

    public User getUser(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }
}