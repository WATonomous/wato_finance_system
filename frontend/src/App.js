import React from 'react'
import {
    Route,
    createBrowserRouter,
    RouterProvider,
    createRoutesFromElements,
} from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'

import { AuthLayout } from './contexts/AuthContext'
import { PrivateRoute, LoggedInRedirect } from './contexts/CustomRoutes'

import Login from './components/Login'
import CreateUser from './components/CreateUser'
import Dashboard from './components/Dashboard'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<AuthLayout />}>
            <Route element={<LoggedInRedirect />}>
                <Route path="/login" element={<Login />} />
            </Route>
            <Route element={<PrivateRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/SF/:id" element={<Dashboard />} />
                <Route path="/FI/:id" element={<Dashboard />} />
                <Route path="/PPR/:id" element={<Dashboard />} />
                <Route path="/UPR/:id" element={<Dashboard />} />
                <Route path="/user" element={<CreateUser />} />
            </Route>
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
