import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navigation from "@client/pages/DashboardPage/Navigation";
import Home from "@client/pages/DashboardPage/Home/Home";
import Services from "@client/pages/DashboardPage/Services/Services";
import Profile from "@client/pages/DashboardPage/Profile/Profile";
import Bookings from "@client/pages/DashboardPage/Bookings/Bookings";
import styles from "@client/pages/DashboardPage/Dashboard.module.css";
import { Role } from "@gofetch/models/IUser";
import Pets from "@client/pages/DashboardPage/Pets/Pets";
import { useAuth } from "@client/context/AuthContext";
import Reviews from "@client/pages/DashboardPage/Reviews/Reviews";

function DashboardPage() {
    const navigate = useNavigate();
    const { user, role, loading } = useAuth();

    useEffect(() => {
        if (!role) {
            navigate("/", { replace: true });
        }
    }, [role, navigate]);

    if (loading || !user) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={`container ${styles.dashboardContainer}`}>
            <Navigation />
            <div className={styles.dashboardContent}>
                <Routes>
                    <Route path="" element={<Home />} />

                    <Route
                        path="services"
                        element={role === Role.MINDER ? (
                            <Services />
                        ) : (
                            <Navigate to="/dashboard" replace />
                        )}
                    />
                    <Route
                        path="profile"
                        element={role === Role.MINDER ? (
                            <Profile />
                        ) : (
                            <Navigate to="/dashboard" replace />
                        )}
                    />
                    <Route
                        path="pets"
                        element={role === Role.OWNER ? (
                            <Pets />
                        ) : (
                            <Navigate to="/dashboard" replace />
                        )}
                    />
                    <Route
                        path="bookings"
                        element={<Bookings />}
                    />
                    <Route
                        path="reviews"
                        element={role === Role.MINDER ? (
                            <Reviews />
                        ) : (
                            <Navigate to="/dashboard" replace />
                        )}
                    />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </div>
        </div>
    );
}

export default DashboardPage;
