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
