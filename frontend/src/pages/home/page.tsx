import { useEffect, useState } from "react"

export default function Home() {

    const [user, setUser] = useState(null)

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
                }

                )
                    .then(res => res.json())
                    .then(data => setUser(data));

            } catch (error) {
                console.error('Error fetching user:', error)
            }
        }

        fetchUser()
    }, [])

    console.log('User:', user)

    return (
        <div>
            <h1>Home</h1>
        </div>
    )
}