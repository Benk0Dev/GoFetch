import styles from './Reports.module.css';
import dashboardStyles from '../Dashboard.module.css';
import { useAuth } from '../../../context/AuthContext';

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