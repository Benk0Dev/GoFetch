import ReportForm from "@client/pages/UserPage/ReportForm";
import { useNavigate } from "react-router-dom";
import styles from "@client/pages/UserPage/Reporting.module.css"
import BackButton from "@client/components/BackButton";

function ReportPage () {
    const navigate = useNavigate

    // Report {name}

    return (
        <div className={`container ${styles.reporting}`}>
            <div className={styles.reportingContainer}>
                <BackButton/>
                <div className={styles.reportingBox}>
                    <h2>Report This User</h2>
                    <ReportForm/>
                </div>
            </div>
        </div>
    );
}

export default ReportPage;
