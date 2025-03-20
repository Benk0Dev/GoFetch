import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import BrowsePage from "./pages/BrowsePage/BrowsePage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import MessagingPage from "./pages/MessagingPage/MessagingPage";
import BookingPage from "./pages/BookingPage/BookingPage";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/messages" element={<MessagingPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
