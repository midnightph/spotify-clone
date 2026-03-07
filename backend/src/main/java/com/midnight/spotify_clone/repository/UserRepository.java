package com.midnight.spotify_clone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.midnight.spotify_clone.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    // Spring já gera o save(), findById(), etc. automaticamente
}