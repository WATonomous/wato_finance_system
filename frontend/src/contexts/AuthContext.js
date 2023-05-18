import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
} from 'firebase/auth'
import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useOutlet } from 'react-router-dom'
import app from '../firebase'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'
import {
    FACULTY_ADVISOR_EMAILS,
    TEAM_CAPTAIN_TITLES,
    DIRECTOR_TITLES,
} from '../constants'

const AuthContext = React.createContext()

export const useAuth = () => {
    return useContext(AuthContext)
}
// TODO: move this somewhere else. will be used specifically for finance coordinator
const whitelist = ['test@test.com']

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState()
    const [currentUserGroup, setCurrentUserGroup] = useState()
    const [currentIdentifier, setCurrentIdentifier] = useState()
    const [isDirector, setIsDirector] = useState()
    const [isTeamCaptain, setIsTeamCaptain] = useState()
    const [isFacultyAdvisor, setIsFacultyAdvisor] = useState()
    const [loading, setLoading] = useState(true)
    const auth = getAuth(app)
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

    const logout = useCallback(() => {
        return signOut(auth)
    }, [auth])

    const setUserGroup = async (user) => {
        if (user) {
            const userEmail = user.email
            const userWatiam = userEmail.substring(0, userEmail.indexOf('@'))
            const searchWithEmail = whitelist.includes(userEmail)
            try {
                const identifier = searchWithEmail ? userEmail : userWatiam
                setCurrentIdentifier(identifier)

                const retrievedGroup = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/googlegroups/${identifier}`
                )
                setCurrentUserGroup(retrievedGroup.data.title)

                const _isFacultyAdvisor =
                    FACULTY_ADVISOR_EMAILS.includes(identifier)
                setIsFacultyAdvisor(_isFacultyAdvisor)

                const _isTeamCaptain =
                    _isFacultyAdvisor ||
                    TEAM_CAPTAIN_TITLES.includes(retrievedGroup.data.title)
                setIsTeamCaptain(_isTeamCaptain)

                const _isDirector =
                    _isTeamCaptain ||
                    DIRECTOR_TITLES.includes(retrievedGroup.data.title)
                setIsDirector(_isDirector)
            } catch (err) {
                console.log('Error: ' + err)
            }
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const email = user.email
                console.log(email)
                if (
                    !email.endsWith('@watonomous.ca') &&
                    !whitelist.includes(email)
                ) {
                    await logout()
                    return
                }
            }
            setCurrentUser(user)
            setLoading(false)

            await setUserGroup(user)
        })
        return unsubscribe
    }, [auth, logout])

    const providerState = {
        currentUser,
        currentUserGroup,
        currentIdentifier,
        isDirector,
        isTeamCaptain,
        isFacultyAdvisor,
        login,
        logout,
    }

    return (
        <AuthContext.Provider value={providerState}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const AuthLayout = () => {
    const outlet = useOutlet()
    return <AuthProvider>{outlet}</AuthProvider>
}
