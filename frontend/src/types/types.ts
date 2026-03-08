// src/types/User.ts
export interface User {
    id: string
    name: string
    email: string
    accessToken: string
    refreshToken: string
    tokenExpiresAt: number
    imageUrl: string
    country: string
    followers: string
}

export interface Playlist {
    id: string
    name: string
    images: { url: string }[]
    items: { total: number }
}