import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "@client/components/Navbar/Navbar";
import Footer from "@client/components/Footer";
import LandingPage from "@client/pages/LandingPage/LandingPage";
import LoginPage from "@client/pages/AuthenticationPage/LoginPage";
import RegisterPage from "@client/pages/AuthenticationPage/RegisterPage";
import BecomeRolePage from "@client/pages/AuthenticationPage/BecomeRolePage";
import EditProfilePage from "@client/pages/EditProfilePage/EditProfilePage";
import BrowsePage from "@client/pages/BrowsePage/BrowsePage";
import UserPage from "@client/pages/UserPage/UserPage";
import DashboardPage from "@client/pages/DashboardPage/Dashboard";
import MessagingPage from "@client/pages/MessagingPage/MessagingPage";
import Chat from "@client/pages/MessagingPage/Chat";
import BookingPage from "@client/pages/BookingPage/BookingPage";
import PaymentPage from "@client/pages/BookingPage/PaymentPage";
import SuccessPage from "@client/pages/BookingPage/SuccessPage";
import AddPetPage from "@client/pages/DashboardPage/Pets/AddPet";
import PetDetailsPage from "@client/pages/DashboardPage/Pets/PetDetails";
import SettingsPage from "@client/pages/SettingsPage/SettingsPage";
import { useAuth } from "@client/context/AuthContext";
import { SocketProvider } from "@client/context/SocketContext";
import { Role } from "@gofetch/models/IUser";
import MinderPage from "@client/pages/MinderPage/MinderPage";
import ReportPage from "./pages/UserPage/ReportPage";
import SuspendedPage from "./pages/SuspendedPage/SuspendedPage";

function App() {
  const { role, loading, user } = useAuth();
  const isGuest = role === null;
  const isSuspended = user?.primaryUserInfo.suspension;

  if (loading) return <div>Loading...</div>;

  return (
    <SocketProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
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
          {/* Protected Routes for non-suspended users */}
          {!isSuspended ? (
            <>
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
              <Route path="/booking/payment" element={<PaymentPage />} />
              <Route path="/booking/success" element={<SuccessPage />} />
              <Route
                path="/dashboard/*"
                element={!isGuest ? <DashboardPage /> : <Navigate to="/" replace />}
              />
              <Route
                path="/edit-profile"
                element={!isGuest ? <EditProfilePage /> : <Navigate to="/" replace />}
              />
              <Route
                path="/report"
                element={!isGuest ? <ReportPage/> : <Navigate to="/" replace/>}
              />
              <Route
                path="/add-pet"
                element={
                  role === Role.OWNER ? <AddPetPage /> : <Navigate to="/" replace />
                }
              />
              <Route
                path="/chats"
                element={!isGuest ? <MessagingPage /> : <Navigate to="/" replace />}
              >
                <Route path=":id" element={<Chat />} />
              </Route>
              <Route path="/minders/:minderId" element={<MinderPage />} />
              <Route path="/pets/:id" element={!isGuest ? <PetDetailsPage /> : <Navigate to="/" replace />} />
              <Route path="/users/:id" element={<UserPage />} />
              <Route
                path="/settings"
                element={!isGuest ? <SettingsPage /> : <Navigate to="/" replace />}
              />
            </>
          ) : (
            // Redirect to /suspended if user is suspended
            <Route path="*" element={<Navigate to="/suspended" replace />} />
          )}

          {/* Suspended Route */}
          <Route
            path="/suspended"
            element={!isGuest && isSuspended ? <SuspendedPage /> : <Navigate to="/" replace />}
          />
        </Routes>
        <Footer />
      </Router>
    </SocketProvider>
  );
}

export default App;
