import { useEffect, useState } from "react"
import { User } from "../../types/User"
import "./style.css"
import LoadingComponent from "./components/LoadingComponent"


export default function Home() {

    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // pequeno delay pra garantir que o App.jsx já salvou o userId
                await new Promise(resolve => setTimeout(resolve, 100))

                const userId = localStorage.getItem("userId")

                if (!userId) {
                    return window.location.href = "/login"
                }

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

    if (isLoading) {
        return <LoadingComponent />
    }

    return (
        <div className="main">
            <div className="header">
                <div className="avatar">
                    <img src={user?.imageUrl} alt="User Avatar" />
                </div>
                <h1 className="username">{user?.name}</h1>
            </div>
        </div>
    )
}
