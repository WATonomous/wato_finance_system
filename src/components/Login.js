import React, { useState } from 'react'
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    
    const handleLogin = async () => {
        setError("")
        setLoading(true)
        try {
            await login()
            navigate("/user")
        } catch {
            setError("Failed to log in. Please retry.")
        }
        setLoading(false)
    }

    return (
        <div>
            <button
                disabled={loading}
                onClick={handleLogin}
            >
                Log In
            </button>
            {error && <span>{error}</span>}
        </div>
    )
}

export default Login