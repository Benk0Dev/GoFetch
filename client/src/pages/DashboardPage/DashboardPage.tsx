import { useState, useEffect } from "react";
import Sidebar from "./Navigation";
import DashboardHome from "./DashboardHome";
import Services from "./Services";
import Profile from "./Profile/Profile";
import Bookings from "./Bookings";
import styles from "./DashboardPage.module.css";
import { useNavigate } from "react-router-dom";
import { getUserId, getUserRole } from "../../utils/StorageManager";
import { getUserById } from "../../services/Registry";
import { Role } from "../../models/IUser";
import Pets from "./Pets/Pets";

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("home");

    useEffect(() => {
        const updateUser = async () => {
            const id = getUserId();
            if (id) {
                const fetchedUser = await getUserById(id);
                setUser(fetchedUser);
            }
            setLoading(false);
        };

        updateUser();
        window.addEventListener("userUpdate", updateUser);
        return () => window.removeEventListener("userUpdate", updateUser);
    }, []);

    useEffect(() => {
        if (!getUserRole()) {
            navigate("/");
        }
    }, []);

    const renderTab = () => {
        if (loading) {
            return <div className={styles.loading}>Loading...</div>;
        }

        if (getUserRole() === Role.MINDER) {
            switch (activeTab) {
                case "services":
                    return <Services user={user} />;
                case "profile":
                    return <Profile user={user} />;
                case "bookings":
                    return <Bookings user={user} />;
                default:
                    return <DashboardHome user={user} />;
            }
        }

        if (getUserRole() === Role.OWNER) {
            switch (activeTab) {
                case "pets":
                    return <Pets user={user} />;
                case "bookings":
                    return <Bookings user={user} />;
                default:
                    return <DashboardHome user={user} />;
            }
        }
    };

    return (
        <div className={`container ${styles.dashboardContainer}`}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className={styles.dashboardContent}>
                {renderTab()}
            </div>
        </div>
    );
}

export default Dashboard;
