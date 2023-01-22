import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
} from 'firebase/auth'
import React, { useContext, useEffect, useState } from 'react'
import { useOutlet } from 'react-router-dom'
import app from '../firebase'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'

const AuthContext = React.createContext()

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState()
    const [currentUserGroup, setCurrentUserGroup] = useState()
    const [loading, setLoading] = useState(true)
    const auth = getAuth(app)
    const whitelist = []
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    const toast = useToast()

    const showToast = () =>
        toast({
            title: 'Invalid email address',
            description:
                'Please use a WATonomous or whitelisted email address.',
            status: 'error',
            duration: 4000,
            isClosable: true,
        })

    const login = () => {
        return signInWithPopup(auth, provider)
            .then((result) => {
                const { email } = result.user
                if (whitelist.includes(email)) return
                if (!email.endsWith('@watonomous.ca')) {
                    signOut(auth)
                    showToast()
                    throw new Error('Invalid email domain')
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const logout = () => {
        return signOut(auth)
    }

    const setUserGroup = async (user) => {
        if (user) {
            const userEmail = user.email
            const userWatiam = userEmail.substring(0, userEmail.indexOf('@'))
            const endpoint = `${process.env.REACT_APP_BACKEND_URL}/group/`

            let searchWithEmail = false
            if (whitelist.includes(userEmail)) searchWithEmail = true //or else use watiam

            try {
                const retrievedGroup = await axios.post(endpoint, {
                    field: searchWithEmail ? userEmail : userWatiam,
                    useEmail: searchWithEmail,
                })
                console.log(retrievedGroup.data.title)
                setCurrentUserGroup(retrievedGroup.data.title)
            } catch (err) {
                console.log('Error: ' + err)
            }
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const email = user.email
                if (
                    !email.endsWith('@watonomous.ca') &&
                    !whitelist.includes(email)
                )
                    return
            }
            setCurrentUser(user)
            setLoading(false)

            await setUserGroup(user)
        })

        return unsubscribe
    }, [auth])

    const value = {
        currentUser,
        currentUserGroup,
        login,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const AuthLayout = () => {
    const outlet = useOutlet()
    return <AuthProvider>{outlet}</AuthProvider>
}
