import React from 'react';
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import './App.css';

// import MainContent from "./components/MainContent";
// import ClaimSummary from "./components/ClaimSummary";
import Login from "./components/Login";
import CreateUser from "./components/CreateUser";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
            <Route exact path="/" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/user" element={<CreateUser/>} />
            {/* <Route path="/claim" element={ClaimSummary} /> */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
