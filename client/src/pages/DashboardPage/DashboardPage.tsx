import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import DashboardHome from "./DashboardHome";
import Services from "./Services";
import Profile from "./Profile/Profile";
import Bookings from "./Bookings";
import styles from "./DashboardPage.module.css";
import { useNavigate } from "react-router-dom";
import { getCurrentUserType } from "../../services/AuthService";

function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!getCurrentUserType()) {
        navigate("/");
        }
    }, []);

    const [activeTab, setActiveTab] = useState("home");

    const renderTab = () => {
        switch (activeTab) {
            case "services":
                return <Services />;
            case "profile":
                return <Profile />;
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
