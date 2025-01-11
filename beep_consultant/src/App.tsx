import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DashBoard from "./ui/pages/DashBoardPage";
import LandingPage from "./ui/pages/LandingPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashBoard />} />
    </Routes>
  );
};

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
