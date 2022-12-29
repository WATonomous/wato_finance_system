import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import { Center, Heading } from '@chakra-ui/react'

const Login = () => {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async () => {
        setLoading(true)
        try {
            await login()
            navigate('/user')
        } catch (err) {
            setError(`Failed to log in, Error: ${err}`)
        }
        setLoading(false)
    }

    return (
        <>
            <Navbar
                onClick={handleLogin}
                authButtonText="Log In"
                authButtonDisabled={loading}
            />
            <Center
                h="calc(100vh - 80px)"
                bgGradient="linear(to-tl, #23a6d5, #23d5ab)"
            >
                <Heading>
                    {error
                        ? error
                        : 'Log in to access the WATonomous Finance System'}
                </Heading>
            </Center>
        </>
    )
}

export default Login
