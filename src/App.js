import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route} from "react-router-dom";

// import MainContent from "./components/MainContent";
// import ClaimSummary from "./components/ClaimSummary";
import CreateUser from "./components/CreateUser";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" exact element={<CreateUser/>} />
          {/* <Route path="/claim" element={ClaimSummary} /> */}
          <Route path="/user" element={<CreateUser/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;