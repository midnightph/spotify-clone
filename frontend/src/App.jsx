import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Login from './pages/login/page'
import Home from './pages/home/page'
import PageTransition from './pages/component/PageTransition'
import { useEffect } from 'react'

function AnimatedRoutes() {
    const location = useLocation()

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    )
}

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
            <AnimatedRoutes />
        </Router>
    )
}

export default App