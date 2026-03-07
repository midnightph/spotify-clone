package com.midnight.spotify_clone.controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.midnight.spotify_clone.config.SpotifyConfig;
import com.midnight.spotify_clone.model.User;
import com.midnight.spotify_clone.repository.UserRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
public class AuthController {

    private final SpotifyConfig spotifyConfig;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AuthController(SpotifyConfig spotifyConfig, UserRepository userRepository) {
        this.spotifyConfig = spotifyConfig;
        this.userRepository = userRepository;
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
    public RedirectView callback(@RequestParam String code, HttpServletResponse response) {
        try {
            // 1. Troca o code pelo token
            JsonNode tokenData = getTokenFromSpotify(code);

            String accessToken = tokenData.get("access_token").asText();
            String refreshToken = tokenData.get("refresh_token").asText();
            long expiresIn = tokenData.get("expires_in").asLong(); // segundos
            long expiresAt = System.currentTimeMillis() + (expiresIn * 1000);

            // 2. Busca dados do usuário no Spotify
            JsonNode userData = getSpotifyUserProfile(accessToken);

            String spotifyId = userData.get("id").asText();
            String name = userData.get("display_name").asText();
            String email = userData.get("email").asText();

            // 3. Salva ou atualiza no Supabase (via JPA)
            User user = userRepository.findById(spotifyId).orElse(new User());
            user.setId(spotifyId);
            user.setName(name);
            user.setEmail(email);
            user.setAccessToken(accessToken);
            user.setRefreshToken(refreshToken);
            user.setTokenExpiresAt(expiresAt);

            userRepository.save(user);

            Cookie cookie = new Cookie("userId", spotifyId);
            cookie.setHttpOnly(true); // JS não consegue ler
            cookie.setSecure(false); // muda pra true em produção (HTTPS)
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60 * 24 * 7); // 7 dias

            response.addCookie(cookie);

            return new RedirectView("http://localhost:5173/?userId=" + spotifyId);

        } catch (Exception e) {
            e.printStackTrace();
            return new RedirectView("http://localhost:5173/error");
        }
    }

    private JsonNode getTokenFromSpotify(String code) throws Exception {
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

    private JsonNode getSpotifyUserProfile(String accessToken) throws Exception {
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
        while ((line = in.readLine()) != null)
            response.append(line);
        in.close();
        return objectMapper.readTree(response.toString());
    }

    @GetMapping("/user")
    public User getUser(@RequestParam String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }
}