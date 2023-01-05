import React from 'react'
import {
    Route,
    createBrowserRouter,
    RouterProvider,
    createRoutesFromElements,
} from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'

import { AuthLayout } from './contexts/AuthContext'
import {
    PrivateRoute,
    LoggedInRedirect,
    PublicRoute,
} from './contexts/CustomRoutes'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ClaimSummary from './pages/ClaimSummary'
import NotFound from './pages/NotFound'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<AuthLayout />}>
            <Route element={<LoggedInRedirect />}>
                <Route path="/login" element={<Login />} />
            </Route>
            <Route element={<PublicRoute />}>
                <Route path="/claim/:id" element={<ClaimSummary />} />
            </Route>
            <Route element={<PrivateRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/SF/:id" element={<Dashboard />} />
                <Route path="/FI/:id" element={<Dashboard />} />
                <Route path="/PPR/:id" element={<Dashboard />} />
                <Route path="/UPR/:id" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Route>
    )
)

const App = () => {
    return (
        <ChakraProvider>
            <RouterProvider router={router} />
        </ChakraProvider>
    )
}

export default App
