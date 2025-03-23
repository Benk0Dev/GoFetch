import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/AuthenticationPage/LoginPage";
import RegisterPage from "./pages/AuthenticationPage/RegisterPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import BrowsePage from "./pages/BrowsePage/BrowsePage";
import DashboardPage from "./pages/DashboardPage/Dashboard";
import MessagingPage from "./pages/MessagingPage/MessagingPage";
import ChatPage from "./pages/MessagingPage/ChatPage";
import BookingPage from "./pages/BookingPage/BookingPage";
import { useAuth } from "./context/AuthContext";
import { Role } from "./models/IUser";

function App() {
  const { role, loading } = useAuth();
  const isGuest = role === null;

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={isGuest ? <LandingPage /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/login"
          element={isGuest ? <LoginPage /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/register"
          element={isGuest ? <RegisterPage /> : <Navigate to="/dashboard" replace />}
        />
        <Route path="/browse" element={<BrowsePage />} />
        <Route
          path="/booking"
          element={role === Role.OWNER ? <BookingPage /> : role === Role.MINDER ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/dashboard/*"
          element={!isGuest ? <DashboardPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/profile"
          element={!isGuest ? <ProfilePage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/chats"
          element={!isGuest ? <MessagingPage /> : <Navigate to="/" replace />}
        >
          <Route path=":id" element={<ChatPage />} />
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;