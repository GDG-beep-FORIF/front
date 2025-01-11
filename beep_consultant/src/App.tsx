import React from 'react';
import { Routes, Route, Navigate, BrowserRouter as Router } from 'react-router-dom';
import LandingPage from './ui/pages/LandingPage';
import LoginPage from './ui/pages/LoginPage';
import SignUpPage from './ui/pages/SignUp';
import { AuthProvider } from './contexts/AuthContext';

const AppRoutes = () => {

  return (
    <Routes>
      <Route
        path="/"
        element={
            <LandingPage />
        }
      />
      <Route
        path="/login"
        element={
            <LoginPage />
        }
      />
      <Route
        path="/signup"
        element={
            <SignUpPage />
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>

    </AuthProvider>
  );
}

export default App;
