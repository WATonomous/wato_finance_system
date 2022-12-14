import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Flex, Heading, Spacer } from '@chakra-ui/react'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { currentUser, login, logout } = useAuth()

    const handleLogin = async () => {
        setLoading(true)
        try {
            await login()
            navigate('/')
        } catch (err) {
            setError('Failed to log in')
            console.log(err)
        }
        setLoading(false)
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            navigate('/login')
        } catch (err) {
            setError('Failed to log out')
            console.log(err)
        }
        setLoading(false)
    }

    return (
        <Flex
            pos="fixed"
            top="0"
            left="0"
            alignItems="center"
            p="16px 24px"
            bgColor="deepskyblue"
            w="100%"
            h="80px"
            zIndex="banner"
        >
            <Heading
                lineHeight="48px"
                onClick={() => navigate('/')}
                cursor="pointer"
            >
                WATonomous Finance System
            </Heading>
            <Spacer />
            <Button
                onClick={currentUser ? handleLogout : handleLogin}
                disabled={loading}
            >
                {error ? error : currentUser ? 'Log Out' : 'Log In'}
            </Button>
        </Flex>
    )
}

export default Navbar
