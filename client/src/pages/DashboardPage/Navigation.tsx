import { Role } from "../../models/IUser";
import styles from "./Navigation.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navigation() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const { role } = useAuth();

    return (
        <div className={styles.navigation}>
            <button
                className={currentPath === "/dashboard" ? styles.active : ""}
                onClick={() => navigate("/dashboard")}
            >
                Overview
            </button>

            {role === Role.MINDER ? (
                <>
                    <button
                        className={currentPath === "/dashboard/profile" ? styles.active : ""}
                        onClick={() => navigate("/dashboard/profile")}
                    >
                        Profile
                    </button>
                    <button
                        className={currentPath === "/dashboard/services" ? styles.active : ""}
                        onClick={() => navigate("/dashboard/services")}
                    >
                        Services
                    </button>
                    <button
                        className={currentPath === "/dashboard/bookings" ? styles.active : ""}
                        onClick={() => navigate("/dashboard/bookings")}
                    >
                        Bookings
                    </button>
                    <button
                        className={currentPath === "/dashboard/reviews" ? styles.active : ""}
                        onClick={() => navigate("/dashboard/reviews")}
                    >
                        Reviews
                    </button>
                </>
            ) : (
                <>
                    <button
                        className={currentPath === "/dashboard/pets" ? styles.active : ""}
                        onClick={() => navigate("/dashboard/pets")}
                    >
                        Pets
                    </button>
                    <button
                        className={currentPath === "/dashboard/bookings" ? styles.active : ""}
                        onClick={() => navigate("/dashboard/bookings")}
                    >
                        Bookings
                    </button>
                </>
            )}
        </div>
    );
}

export default Navigation;
