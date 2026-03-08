import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/login/page'
import Home from './pages/home/page'
import './App.css'
import { useEffect } from 'react'

function App() {

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const userId = params.get("userId")
    if (userId) {
      localStorage.setItem("userId", userId)
      window.history.replaceState({}, "", "/")

      // busca os tokens do backend e salva
      fetch(`${import.meta.env.VITE_API_URL}/user?userId=${userId}`)
        .then(r => r.json())
        .then(user => {
          localStorage.setItem("accessToken", user.accessToken)
          localStorage.setItem("refreshToken", user.refreshToken)
        })
    }
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App