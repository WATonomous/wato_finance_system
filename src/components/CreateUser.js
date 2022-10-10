import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CreateUser = (props) => {
    const [error, setError] = useState('')
    const [username, setUsername] = useState('')
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        setError('')
        try {
            await logout()
            navigate('/login')
        } catch {
            setError('Failed to log out')
        }
    }

    const onSubmit = (e) => {
        e.preventDefault()

        const user = { username }

        console.log(user)

        axios
            .post('http://localhost:5000/users/add', user)
            .then((res) => console.log(res.data))
    }

    return (
        <div>
            <button onClick={handleLogout}>Log Out</button>
            {error && <span>{error}</span>}
            <h3>Create New User</h3>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Username: </label>
                    <input
                        type="text"
                        required
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="submit"
                        value="Create User"
                        className="btn btn-primary"
                    />
                </div>
            </form>
        </div>
    )
}

export default CreateUser
