import React from 'react'
import { useEffect, useState } from 'react';
import "./style.css";

export default function Login() {
  function handleLogin() {
    window.location.href = `${import.meta.env.VITE_API_URL}/login`
  }

  return (
    <div>
      <div className="login-container">
        <h1>Login</h1>
        <button onClick={handleLogin}>Entrar com Spotify</button>
      </div>
    </div>
  )
}