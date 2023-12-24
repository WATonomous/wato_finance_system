import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export const PrivateRoute = () => {
    const { currentUser } = useAuth()

    const location = useLocation()

    if (typeof currentUser === 'undefined') return <h1>Loading.....</h1>
    if (!currentUser)
        return (
            <Navigate
                replace
                to="/login"
                state={{
                    from:
                        location.pathname !== '/login'
                            ? location.pathname
                            : '/',
                }}
            />
        )
    return <Outlet />
}

export const PublicRoute = () => {
    return <Outlet />
}

export const LoggedInRedirect = () => {
    const { currentUser } = useAuth()

    const location = useLocation()

    const prevLocation = location.state ? location.state['from'] : '/'

    if (currentUser) return <Navigate replace to={prevLocation} />
    return <Outlet />
}
