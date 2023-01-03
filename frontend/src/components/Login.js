import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Center, Heading, VStack } from '@chakra-ui/react'

import { useAuth } from '../contexts/AuthContext'
import Navbar from './Navbar'

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
        <VStack spacing="0">
            <Navbar
                onClick={handleLogin}
                authButtonText="Log In"
                authButtonDisabled={loading}
            />
            <Center
                w="100%"
                h="calc(100vh - 80px)"
                bgGradient="linear(to-tl, #23a6d5, #23d5ab)"
            >
                <Heading>
                    {error
                        ? error
                        : 'Log in to access the WATonomous Finance System'}
                </Heading>
            </Center>
        </VStack>
    )
}

export default Login
