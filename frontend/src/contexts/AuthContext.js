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
import { useToast } from '@chakra-ui/react'
import {
    ADMIN_IDENTIFIERS,
    TEAM_CAPTAIN_TITLES,
    DIRECTOR_TITLES,
} from '../constants'
import { axiosPreset } from '../axiosConfig'

const AuthContext = React.createContext()

export const useAuth = () => {
    return useContext(AuthContext)
}
// TODO: move this somewhere else. will be used specifically for finance coordinator
const whitelist = ['test@test.com']

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState()
    const [currentUserGroup, setCurrentUserGroup] = useState()
    const [isDirector, setIsDirector] = useState()
    const [isTeamCaptain, setIsTeamCaptain] = useState()
    const [isAdmin, setIsAdmin] = useState()
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
            const identifier = searchWithEmail ? userEmail : userWatiam

            const retrievedGroup = await axiosPreset.get(
                `${process.env.REACT_APP_BACKEND_URL}/googlegroups/${identifier}`
            )
            setCurrentUserGroup(retrievedGroup?.data?.title)

            let _isAdmin,
                _isTeamCaptain,
                _isDirector = false
            if (process.env?.REACT_APP_AUTH_OVERRIDE) {
                const authRoles =
                    process.env?.REACT_APP_AUTH_OVERRIDE?.split(',')
                console.log(authRoles)
                _isAdmin = authRoles.includes('ADMIN')
                _isTeamCaptain = authRoles.includes('TEAM_CAPTAIN') || isAdmin
                _isDirector = authRoles.includes('DIRECTOR') || isTeamCaptain
            } else {
                _isAdmin = ADMIN_IDENTIFIERS.includes(identifier)

                _isTeamCaptain =
                    _isAdmin ||
                    TEAM_CAPTAIN_TITLES.includes(retrievedGroup.data.title)

                _isDirector =
                    _isTeamCaptain ||
                    DIRECTOR_TITLES.includes(retrievedGroup.data.title)
            }
            console.log(_isAdmin)
            console.log(_isDirector)
            console.log(_isTeamCaptain)
            setIsAdmin(_isAdmin)
            setIsDirector(_isDirector)
            setIsTeamCaptain(_isTeamCaptain)
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const email = user.email
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
        isDirector,
        isTeamCaptain,
        isAdmin,
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
