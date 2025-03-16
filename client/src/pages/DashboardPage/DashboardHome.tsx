import styles from "./DashboardHome.module.css";
import dashboardStyles from "./DashboardPage.module.css";
import { getAllCurrentUserDetails } from "../../services/AuthService";

function DashboardHome() {
    const userFirstName = getAllCurrentUserDetails()?.fname;

    return (
        <div className={dashboardStyles.dashboardSection}>
            <h2>Welcome Back, {userFirstName}!</h2>
            <div className={styles.stats}>
                <div>
                    <h3>12</h3>
                    <p>Total Bookings</p>
                </div>
                <div>
                    <h3>4.8 ⭐</h3>
                    <p>Profile Rating</p>
                </div>
                <div>
                    <h3>5</h3>
                    <p>Active Services</p>
                </div>
            </div>
            <h3>Upcoming Bookings</h3>
            <ul>
                <li>🐕 Walk for Bella - Tomorrow at 10AM</li>
                <li>🐶 Overnight Boarding for Max - Friday 6PM</li>
            </ul>
        </div>
    );
}

export default DashboardHome;
