import { useEffect, useState } from "react"
import { User } from "../../types/User"
import "./style.css"
import LoadingComponent from "./components/LoadingComponent"

export default function Home() {

    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Fetch user data from API or local storage
        const fetchUser = async () => {
            try {
                const userId = localStorage.getItem("userId")

                if (!userId) {
                    return window.location.href = "/login"
                }
                fetch(`${import.meta.env.VITE_API_URL}/user?userId=${userId}`, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        if (!data) {
                            return window.location.href = "/login"
                        }
                        setUser(data)
                    });
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
                <h1>{user?.name}</h1>
            </div>
        </div>
    )
}
