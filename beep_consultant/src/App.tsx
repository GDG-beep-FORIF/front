import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./ui/pages/DashBoardPage";
import LandingPage from "./ui/pages/LandingPage";
import LoginPage from "./ui/pages/LoginPage";
import SignUpPage from "./ui/pages/SignUp";
import SummaryPage from "./ui/pages/Summary";
import ChatPage from "./ui/pages/Chat";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/summary/:roomId" element={<Summary />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
};

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
