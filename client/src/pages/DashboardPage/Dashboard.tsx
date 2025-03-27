import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import Home from "./Home/Home";
import Services from "./Services/Services";
import Profile from "./Profile/Profile";
import Bookings from "./Bookings/Bookings";
import styles from "./Dashboard.module.css";
import { Role } from "../../models/IUser";
import Pets from "./Pets/Pets";
import { useAuth } from "../../context/AuthContext";
import Reviews from "./Reviews/Reviews";

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
