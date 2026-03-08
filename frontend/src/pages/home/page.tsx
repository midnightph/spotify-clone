import { useEffect, useState } from "react"
import { User } from "../../types/User"
import "./style.css"
import LoadingComponent from "./components/LoadingComponent"
import PlaylistsComponent from "./components/PlaylistsComponent"
import TracksComponent from "./components/TrackComponent"

export default function Home() {

    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null)
    const [tracks, setTracks] = useState([])

    useEffect(() => {
        const fetchUser = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 100))
                const userId = localStorage.getItem("userId")
                if (!userId) return window.location.href = "/login"
                //@ts-ignore
                const data = await fetch(`${import.meta.env.VITE_API_URL}/user?userId=${userId}`, {
                    headers: { 'ngrok-skip-browser-warning': 'true' }
                }).then(r => r.json())
                setUser(data)
            } catch (error) {
                console.error('Error fetching user:', error)
                window.location.href = "/login"
            } finally {
                setIsLoading(false)
            }
        }
        fetchUser()
    }, [])

    useEffect(() => {
        const fetchPlaylist = async () => {
            if (!selectedPlaylist) return
            //@ts-ignore
            const data = await fetch(`${import.meta.env.VITE_API_URL}/musicsFromPlaylist?userId=${localStorage.getItem("userId")}&playlistId=${selectedPlaylist}`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            }).then(r => r.json())
            setTracks(data.items ?? [])
        }

        fetchPlaylist()
    }, [selectedPlaylist])

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
                    <PlaylistsComponent userId={localStorage.getItem("userId") || ""} callback={setSelectedPlaylist} />
                </aside>
                <main className="main-content">
                    <TracksComponent tracks={tracks} />
                </main>
            </div>

            <footer className="player">
                {/* player aqui */}
            </footer>
        </div>
    )
}