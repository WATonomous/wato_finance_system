import React from 'react'
import {
    Navigate,
    Route,
    createBrowserRouter,
    RouterProvider,
    createRoutesFromElements,
} from 'react-router-dom'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

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

const WATonomousTheme = extendTheme({
    colors: {
        wato: {
            offBlack: '#222222',
            grey: '#414141',
            offWhite: '#c7cfd8',

            primaryDark: '#08192d',
            primary: '#0f4271',
            secondary: '#1f5d96',

            greenDark: '#0c4842',
            greenLight: '#66ddc8',

            redDark: '#92093a',
            redLight: '#d8436d',
        },
    },
    components: {
        Button: {
            variants: {
                offWhite: {
                    bgColor: 'wato.offWhite',
                    _hover: {
                        bgColor: 'wato.offWhite',
                    },
                },
                grey: {
                    color: 'white',
                    bgColor: 'wato.grey',
                    _hover: {
                        bgColor: 'wato.grey',
                    },
                },
                secondary: {
                    color: 'white',
                    bgColor: 'wato.secondary',
                    _hover: {
                        bgColor: 'wato.secondary',
                    },
                },
                greenDark: {
                    color: 'white',
                    bgColor: 'wato.greenDark',
                    _hover: {
                        bgColor: 'wato.greenDark',
                    },
                },
                greenLight: {
                    bgColor: 'wato.greenLight',
                    _hover: {
                        bgColor: 'wato.greenLight',
                    },
                },
                redDark: {
                    color: 'white',
                    bgColor: 'wato.redDark',
                    _hover: {
                        bgColor: 'wato.redDark',
                    },
                },
            },
        },
    },
})

export default App
