import React from 'react'
import {
    Navigate,
    Route,
    createBrowserRouter,
    RouterProvider,
    createRoutesFromElements,
} from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { WATonomousTheme } from './theme'

import { AuthLayout } from './contexts/AuthContext'
import { PrivateRoute, LoggedInRedirect } from './contexts/CustomRoutes'
import { RecoilRoot } from 'recoil'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'

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
                <Route path="/claim/:id" element={<Dashboard />} />
            </Route>
            <Route path="/notfound" element={<NotFound />} />
            <Route path="*" element={<Navigate replace to="/notfound" />} />
        </Route>
    )
)

const App = () => {
    return (
        <RecoilRoot>
            <ChakraProvider theme={WATonomousTheme}>
                <RouterProvider router={router} />
            </ChakraProvider>
        </RecoilRoot>
    )
}

export default App
