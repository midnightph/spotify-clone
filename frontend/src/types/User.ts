// src/types/User.ts
export interface User {
    id: string
    name: string
    email: string
    accessToken: string
    refreshToken: string
    tokenExpiresAt: number
}