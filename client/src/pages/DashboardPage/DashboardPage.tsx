import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import DashboardHome from "./DashboardHome";
import Services from "./Services";
import Profile from "./Profile/Profile";
import Bookings from "./Bookings";
import styles from "./DashboardPage.module.css";
import { useNavigate } from "react-router-dom";
import { getUserId, getUserRole } from "../../utils/StorageManager";
import { getUserById } from "../../services/Registry";
import { Role } from "../../models/IUser";

function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    useEffect(() => {
        const updateUser = async () => {
            const id = getUserId();
            if (id) {
                const user = await getUserById(id);
                setUser(user);
            }
        };
        window.addEventListener("userUpdate", updateUser);
        return () => window.removeEventListener("userUpdate", updateUser);
    }, []);

    useEffect(() => {
        if (!getUserRole()) {
        navigate("/");
        }
    }, []);

    const [activeTab, setActiveTab] = useState("home");

    const renderTab = () => {
        switch (activeTab) {
            case "services":
                return <Services />;
            case "profile":
                return getUserRole() === Role.MINDER ? <Profile user={user} /> : null;
            case "bookings":
                return <Bookings />;
            default:
                return <DashboardHome />;
        }
    };

    const navBarHeight: number = document.getElementById("navbar")?.offsetHeight || 0;

    return (
        <div className={`container ${styles.dashboardContainer}`} style={{ minHeight: `calc(100vh - ${navBarHeight}px)`}}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className={styles.dashboardContent}>
                {renderTab()}
            </div>
        </div>
    );
}

export default Dashboard;
