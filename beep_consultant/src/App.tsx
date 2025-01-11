import React from 'react';
import { Routes, Route, Navigate, BrowserRouter as Router } from 'react-router-dom';
import LandingPage from './ui/pages/LandingPage';

const AppRoutes = () => {

  return (
    <Routes>
      <Route
        path="/"
        element={
            <LandingPage />
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
