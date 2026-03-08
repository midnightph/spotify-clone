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
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        //@ts-ignore
        const fetchPlaylists = async () => {
            //@ts-ignore
            await fetch(`${import.meta.env.VITE_API_URL}/playlist?userId=${userId}`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            })
                .then(res => res.json())
                .then(data => setPlaylists(data.items ?? []))
                .finally(() => setIsLoading(false))
        }

        fetchPlaylists()
    }, [userId])

    console.log(playlists)

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
                    <div key={playlist.id} className="playlist-item">
                        <img src={playlist.images[0]?.url} alt={playlist.name} />
                        <span>{playlist.name}</span>
                    </div>
                ))
            )}
        </div>
    )
}