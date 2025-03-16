import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import registry from "./services/Registry";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import BrowsePage from "./pages/BrowsePage/BrowsePage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import { assignCurrentUser } from "./services/AuthService";

function App() {
  const [isRegistryLoaded, setIsRegistryLoaded] = useState(false);

  // Initialize registry on app startup
  useEffect(() => {
    async function loadRegistry() {
      await registry.initialize();
      setIsRegistryLoaded(true); // Only allow rendering after Registry is ready
      assignCurrentUser(); // Assign current user to registry
    }
    loadRegistry();
  }, []);

  // Prevent rendering until Registry is loaded
  if (!isRegistryLoaded) {
    return <div>Loading...</div>; // Replace with a proper loading screen if needed
  }

  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-owner" element={<RegisterPage />} />
        <Route path="/register-minder" element={<RegisterPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
