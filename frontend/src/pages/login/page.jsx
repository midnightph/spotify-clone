import React from 'react'
import { useEffect, useState } from 'react';

export default function Login() {
  function handleLogin() {
    window.location.href = `${import.meta.env.VITE_API_URL}/login`
  }

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Entrar com Spotify</button>
    </div>
  )
}