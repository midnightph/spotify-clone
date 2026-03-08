import { useEffect, useState } from "react"
import "./PlaylistsComponent.css"
import { Playlist } from "../../../types/types"


interface Props {
    userId: string,
    callback: (playlistId: string) => void
    playlistCallback: (playlists: Playlist[]) => void
}

export default function PlaylistsComponent({ userId, callback, playlistCallback }: Props) {
    const [isLoading, setIsLoading] = useState(true)
    const [playlists, setPlaylists] = useState<Playlist[]>([])

    useEffect(() => {
        //@ts-ignore
        const fetchPlaylists = async () => {
            //@ts-ignore
            await fetch(`${import.meta.env.VITE_API_URL}/playlist?userId=${userId}`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            })
                .then(res => res.json())
                .then(data => {
                    playlistCallback(data.items ?? [])
                    setPlaylists(data.items ?? [])
                })
                .finally(() => setIsLoading(false))
        }

        fetchPlaylists()
    }, [userId])

    function PlaylistsSkeleton() {
        return (
            <>
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="playlist-skeleton">
                        <div className="skeleton-img" />
                        <div className="skeleton-text" />
                    </div>
                ))}
            </>
        )
    }

    return (
        <div className="playlists-container">
            {isLoading ? (
                <PlaylistsSkeleton />
            ) : (
                playlists.map(playlist => (
                    <div key={playlist.id} className="playlist-item" onClick={() => callback(playlist.id)}>
                        <img src={playlist.images[0]?.url} alt={playlist.name} />
                        <div className="playlist-item-info">
                            <span className="playlist-item-name">{playlist.name}</span>
                            <span className="playlist-item-meta">Playlist • {playlist.owner.display_name}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}