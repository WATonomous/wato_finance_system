import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import {
    Center,
    Heading,
    keyframes,
    usePrefersReducedMotion,
} from '@chakra-ui/react'

const Login = () => {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()
    const prefersReducedMotion = usePrefersReducedMotion()

    const bgKeyframe = keyframes`
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    `

    const handleLogin = async () => {
        setLoading(true)
        try {
            await login()
            navigate('/user')
        } catch {
            setError('Failed to log in, please retry')
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
                bgGradient="linear(to-tl, #ee7752, #e73c7e, #23a6d5, #23d5ab)"
                bgSize="400% 400%"
                animation={
                    prefersReducedMotion
                        ? undefined
                        : `${bgKeyframe} 15s ease infinite`
                }
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
