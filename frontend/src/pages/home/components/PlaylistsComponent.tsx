import { useEffect, useState } from "react"
import "./PlaylistsComponent.css"

interface Playlist {
    id: string
    name: string
    images: { url: string }[]
    items: { total: number }
}

interface Props {
    userId: string
}

export default function PlaylistsComponent({ userId }: Props) {
    const [playlists, setPlaylists] = useState<Playlist[]>([])

    useEffect(() => {
        //@ts-ignore
        fetch(`${import.meta.env.VITE_API_URL}/playlist?userId=${userId}`, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
        })
        .then(res => res.json())
        .then(data => setPlaylists(data.items))
    }, [userId])

    return (
        <div className="playlists-container">
            {playlists.map(playlist => (
                <div key={playlist.id} className="playlist-item">
                    <img src={playlist.images[0]?.url} alt={playlist.name} />
                    <span>{playlist.name}</span>
                </div>
            ))}
        </div>
    )
}