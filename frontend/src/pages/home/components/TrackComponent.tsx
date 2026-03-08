import "./TrackComponent.css"

interface Track {
    added_at: string
    item: {
        id: string
        name: string
        duration_ms: number
        artists: { name: string }[]
        album: {
            name: string
            images: { url: string }[]
        }
    }
}

interface Props {
    tracks: Track[]
    isPossible?: boolean
    loading?: boolean
}

function formatDuration(ms: number) {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function TracksSkeleton() {
    return (
        <>
            {[...Array(15)].map((_, i) => (
                <div key={i} className="track-skeleton">
                    <div className="track-skeleton-num" />
                    <div className="track-skeleton-img" />
                    <div className="track-skeleton-info">
                        <div className="track-skeleton-name" />
                        <div className="track-skeleton-artist" />
                    </div>
                    <div className="track-skeleton-album" />
                    <div className="track-skeleton-duration" />
                </div>
            ))}
        </>
    )
}

export default function TracksComponent({ tracks, isPossible, loading }: Props) {
    return (
        <div className="tracks-container">
            {isPossible && <div className="not-possible">Due to API limitations, this playlist cannot be loaded.</div>}
            {loading ? <TracksSkeleton /> : (
                tracks.map((t, index) => (
                    <div key={t.item.id} className="track-item">
                        <span className="track-number">{index + 1}</span>
                        <div className="track-img-wrapper">
                            <img src={t.item.album.images[0]?.url} alt={t.item.album.name} />
                            <div className="track-play-btn">▶</div>
                        </div>
                        <div className="track-info">
                            <span className="track-name">{t.item.name}</span>
                            <span className="track-artist">{t.item.artists[0]?.name}</span>
                        </div>
                        <span className="track-album">{t.item.album.name}</span>
                        <span className="track-duration">{formatDuration(t.item.duration_ms)}</span>
                    </div>
                ))
            )}

        </div>
    )
}