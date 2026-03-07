import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/login/page'
import Home from './pages/home/page'
import './App.css'

function App() {
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
