import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

export const PrivateRoute = () => {
    const { currentUser } = useAuth()

    if (typeof currentUser === 'undefined') return <h1>Loading.....</h1>
    if (!currentUser) return <Navigate replace to="/login" />
    return <Outlet />
}

export const PublicRoute = () => {
    return <Outlet />
}

export const LoggedInRedirect = () => {
    const { currentUser } = useAuth()
    if (currentUser) return <Navigate replace to="/" />
    return <Outlet />
}
