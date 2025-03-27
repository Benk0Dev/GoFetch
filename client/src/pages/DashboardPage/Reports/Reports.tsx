import styles from '@client/pages/DashboardPage/Reports/Reports.module.css';
import dashboardStyles from '@client/pages/DashboardPage/DashboardPage.module.css';
import { useAuth } from '@client/context/AuthContext';

function Report() {
    const { user } = useAuth();

    return (
        <div className={dashboardStyles.dashboardSection}>
            <h2>Reports</h2>
            <p>View reports created by users.</p>
        </div>
    );
}

export default Report;