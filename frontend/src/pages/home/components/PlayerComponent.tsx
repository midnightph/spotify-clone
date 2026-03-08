// components/PlayerComponent.tsx
import { useState, useEffect } from "react"
import "./PlayerComponent.css"

interface Track {
    id: string
    name: string
    preview_url: string | null
    artists: { name: string }[]
    album: { name: string; images: { url: string }[] }
    duration_ms: number
}

interface Props {
    track: Track | null
}

function formatDuration(ms: number) {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export default function PlayerComponent({ track }: Props) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        setIsPlaying(false)
        setProgress(0)
    }, [track])

    useEffect(() => {
        if (!isPlaying) return
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    setIsPlaying(false)
                    return 0
                }
                return p + (100 / ((track?.duration_ms ?? 30000) / 100))
            })
        }, 100)
        return () => clearInterval(interval)
    }, [isPlaying, track])

    if (!track) return (
        <div className="player empty">
            <span>Selecione uma música</span>
        </div>
    )

    return (
        <div className="player">
            <div className="player-track">
                <img src={track.album.images[0]?.url} alt={track.album.name} />
                <div className="player-track-info">
                    <span className="player-track-name">{track.name}</span>
                    <span className="player-track-artist">{track.artists[0]?.name}</span>
                </div>
            </div>

            <div className="player-controls">
                <button className="player-btn-prev">⏮</button>
                <button onClick={() => setIsPlaying(!isPlaying)} className="player-btn">
                    {isPlaying ? "⏸" : "▶"}
                </button>
                <button className="player-btn-next">⏭</button>
                <div className="player-progress-bar">
                    <div className="player-progress" style={{ width: `${progress}%` }} />
                </div>
                <span className="player-duration">{formatDuration(track.duration_ms)}</span>
            </div>
        </div>
    )
}