import { Role } from "../../models/IUser";
import { getUserRole } from "../../utils/StorageManager";
import styles from "./Navigation.module.css";

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    return (
        <div className={styles.sidebar}>
            <button className={activeTab === "home" ? styles.active : ""} onClick={() => setActiveTab("home")}>Overview</button>
            {getUserRole() === Role.MINDER ? (
                <>
                    <button className={activeTab === "profile" ? styles.active : ""} onClick={() => setActiveTab("profile")}>Profile</button>
                    <button className={activeTab === "services" ? styles.active : ""} onClick={() => setActiveTab("services")}>Services</button>
                    <button className={activeTab === "bookings" ? styles.active : ""} onClick={() => setActiveTab("bookings")}>Bookings</button>
                </>
            ) : (
                <>
                    <button className={activeTab === "pets" ? styles.active : ""} onClick={() => setActiveTab("pets")}>Pets</button>
                    <button className={activeTab === "bookings" ? styles.active : ""} onClick={() => setActiveTab("bookings")}>Bookings</button>
                </>
            )}
        </div>
    );
}

export default Sidebar;
