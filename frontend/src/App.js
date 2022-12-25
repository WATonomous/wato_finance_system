import React from 'react'
import { AuthLayout } from './contexts/AuthContext'
import {
    Route,
    createBrowserRouter,
    RouterProvider,
    createRoutesFromElements,
} from 'react-router-dom'
import { PrivateRoute, LoggedInRedirect } from './contexts/CustomRoutes'

import './App.css'

// import MainContent from "./components/MainContent";
// import ClaimSummary from "./components/ClaimSummary";
import Login from './components/Login'
import CreateUser from './components/CreateUser'
import Dashboard from './components/Dashboard'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<AuthLayout />}>
            <Route element={<LoggedInRedirect />}>
                <Route path="/login" element={<Login />} />
            </Route>
            <Route element={<PrivateRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/user" element={<CreateUser />} />
                {/* <Route path="/claim" element={ClaimSummary} /> */}
            </Route>
        </Route>
    )
)

const theme = extendTheme({
    textStyles: {
        navbarTitle: {
            fontSize: '32px',
            fontWeight: '700',
            lineHeight: '48px',
        },
    }
})

const App = () => {
    return (
        <ChakraProvider theme={theme}>
            <RouterProvider router={router} />
        </ChakraProvider>
    )
}

export default App
