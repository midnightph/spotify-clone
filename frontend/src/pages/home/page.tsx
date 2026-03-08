import { useEffect, useState } from "react"
import { User } from "../../types/User"
import "./style.css"
import LoadingComponent from "./components/LoadingComponent"
import PlaylistsComponent from "./components/PlaylistsComponent"

export default function Home() {

    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 100))
                const userId = localStorage.getItem("userId")
                if (!userId) return window.location.href = "/login"
                //@ts-ignore
                await fetch(`${import.meta.env.VITE_API_URL}/user?userId=${userId}`, {
                    headers: { 'ngrok-skip-browser-warning': 'true' }
                })
                    .then(res => res.json())
                    .then(data => {
                        if (!data) return window.location.href = "/login"
                        setUser(data)
                    })
            } catch (error) {
                console.error('Error fetching user:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchUser()
    }, [])

    if (isLoading) return <LoadingComponent />

    return (
        <div className="app-layout">
            <header className="header">
                <div className="avatar">
                    <img src={user?.imageUrl} alt="User Avatar" />
                </div>
                <h1 className="username">{user?.name}</h1>
            </header>

            <div className="content">
                <aside className="sidebar">
                    <PlaylistsComponent userId={localStorage.getItem("userId") || ""} />
                </aside>
                <main className="main-content">
                    {/* conteúdo principal aqui */}
                </main>
            </div>

            <footer className="player">
                {/* player aqui */}
            </footer>
        </div>
    )
}