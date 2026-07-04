import { Routes, BrowserRouter, Route } from "react-router-dom";
import LoginPage from "./components/Login";
import DashboardPage from "./components/Dashboard";
import SignupPage from "./components/Signup";
import LandingPage from "./components/Landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
