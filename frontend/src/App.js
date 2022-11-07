import React from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PrivateRoute, LoggedInRedirect } from './contexts/CustomRoutes'

import './App.css'

// import MainContent from "./components/MainContent";
// import ClaimSummary from "./components/ClaimSummary";
import Login from './components/Login'
import CreateUser from './components/CreateUser'

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route element={<LoggedInRedirect />}>
                        <Route path="/login" element={<Login />} />
                    </Route>
                    <Route element={<PrivateRoute />}>
                        <Route exact path="/" element={<CreateUser />} />
                        <Route path="/user" element={<CreateUser />} />
                        {/* <Route path="/claim" element={ClaimSummary} /> */}
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
