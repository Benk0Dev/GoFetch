import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "@client/components/Navbar/Navbar";
import Footer from "@client/components/Footer";
import LandingPage from "@client/pages/LandingPage/LandingPage";
import LoginPage from "@client/pages/AuthenticationPage/LoginPage";
import RegisterPage from "@client/pages/AuthenticationPage/RegisterPage";
import BecomeRolePage from "@client/pages/AuthenticationPage/BecomeRolePage";
import ProfilePage from "@client/pages/ProfilePage/ProfilePage";
import BrowsePage from "@client/pages/BrowsePage/BrowsePage";
import UserPage from "@client/pages/UserPage/UserPage";
import DashboardPage from "@client/pages/DashboardPage/Dashboard";
import MessagingPage from "@client/pages/MessagingPage/MessagingPage";
import ChatPage from "@client/pages/MessagingPage/ChatPage";
import BookingPage from "@client/pages/BookingPage/BookingPage";
import AddPetPage from "@client/pages/DashboardPage/Pets/AddPet";
import PetDetailsPage from "@client/pages/DashboardPage/Pets/PetDetails";
import { useAuth } from "@client/context/AuthContext";
import { SocketProvider } from "@client/context/SocketContext";
import { Role } from "@gofetch/models/IUser";
import ViewProfile from "./pages/BrowsePage/viewProfile";

function App() {
  const { role, loading } = useAuth();
  const isGuest = role === null;

  if (loading) return <div>Loading...</div>;

  return (
    <SocketProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={isGuest || role === Role.ADMIN ? <LandingPage /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/login"
            element={
              isGuest ? <LoginPage /> : <Navigate to="/dashboard" replace />
            }
          />
          <Route
            path="/register"
            element={
              isGuest ? <RegisterPage /> : <Navigate to="/dashboard" replace />
            }
          />
          <Route
            path="/become-minder"
            element={
              role === Role.OWNER ? (
                <BecomeRolePage role={Role.MINDER} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/become-owner"
            element={
              role === Role.MINDER ? (
                <BecomeRolePage role={Role.OWNER} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/browse" element={<BrowsePage />} />
          <Route
            path="/booking"
            element={
              role === Role.OWNER ? (
                <BookingPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
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
            path="/add-pet"
            element={
              role === Role.OWNER ? <AddPetPage /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/chats"
            element={!isGuest ? <ChatPage /> : <Navigate to="/" replace />}
          >
            <Route path=":id" element={<MessagingPage />} />
          </Route>
          <Route path="/minders/:minderId" element={<ViewProfile />} />
          <Route path="/dashboard/pets/:id" element={role === Role.OWNER ? <PetDetailsPage /> : <Navigate to="/" replace />} />
          <Route path="/users/:id" element={<UserPage />} />
        </Routes>
        <Footer />
      </Router>
    </SocketProvider>
  );
}

export default App;
