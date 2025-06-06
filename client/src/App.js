// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';
import Register from './pages/Register';
import Login from './pages/Login';
import OTPVerification from './pages/OTPVerification';
import Success from './pages/Success';

function App() {
  return (
    <FluentProvider theme={teamsLightTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<OTPVerification />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </Router>
    </FluentProvider>
  );
}

export default App;
