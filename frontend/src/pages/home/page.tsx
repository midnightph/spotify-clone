import { useEffect, useState } from "react"
import { User, Playlist } from "../../types/types"
import "./style.css"
import LoadingComponent from "./components/LoadingComponent"
import PlaylistsComponent from "./components/PlaylistsComponent"
import TracksComponent from "./components/TrackComponent"

export default function Home() {

    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null)
    const [tracks, setTracks] = useState([])
    const [playlist, setPlaylist] = useState<Playlist[]>([])
    const [isLoadingTracks, setIsLoadingTracks] = useState(false)

    function canLoad () {
        if(playlist.find(p => p.id === selectedPlaylist && p.owner.display_name !== user?.name)) {
            return true
        }
        return false
    }

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
            if (!canLoad()) {
                setIsLoadingTracks(true)
            }
            setTracks([])
            //@ts-ignore
            const data = await fetch(`${import.meta.env.VITE_API_URL}/musicsFromPlaylist?userId=${localStorage.getItem("userId")}&playlistId=${selectedPlaylist}`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            }).then(r => r.json())
            setTracks(data.items ?? [])
            setIsLoadingTracks(false)
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
                    <PlaylistsComponent userId={localStorage.getItem("userId") || ""} callback={setSelectedPlaylist} playlistCallback={setPlaylist} />
                </aside>
                <main className="main-content">
                    {selectedPlaylist && (
                        <div className="playlist-info">
                            <>
                                <img src={playlist.find(p => p.id === selectedPlaylist)?.images[0]?.url} alt="Playlist Cover" />
                                <div className="playlist-details">
                                    <span>Playlist</span>
                                    <h2 className="playlist-name">{playlist.find(p => p.id === selectedPlaylist)?.name}</h2>
                                    <p className="playlist-total">{playlist.find(p => p.id === selectedPlaylist)?.items?.total} músicas</p>
                                </div>
                            </>

                        </div>
                    )}
                    <TracksComponent tracks={tracks} isPossible={canLoad()} loading={isLoadingTracks} />
                </main>
            </div>

            <footer className="player">
                {/* player aqui */}
            </footer>
        </div>
    )
}