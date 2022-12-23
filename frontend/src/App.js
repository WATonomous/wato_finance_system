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

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<AuthLayout />}>
            <Route element={<LoggedInRedirect />}>
                <Route path="/login" element={<Login />} />
            </Route>
            <Route element={<PrivateRoute />}>
                <Route exact path="/" element={<CreateUser />} />
                <Route path="/user" element={<CreateUser />} />
                {/* <Route path="/claim" element={ClaimSummary} /> */}
            </Route>
        </Route>
    )
)

const App = () => {
    return <RouterProvider router={router} />
}

export default App
