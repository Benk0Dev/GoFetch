import ReportForm from "@client/pages/UserPage/ReportForm";
import styles from "@client/pages/UserPage/Reporting.module.css"
import BackButton from "@client/components/BackButton";
import { useLocation } from "react-router-dom";

function ReportPage () {
    const location = useLocation();
    const { reporteeName } = location.state || {};

    return (
        <div className={`container ${styles.reporting}`}>
            <div className={styles.reportingContainer}>
                <BackButton/>
                <div className={styles.reportingBox}>
                    <h2>Report {reporteeName}</h2>
                    <ReportForm/>
                </div>
            </div>
        </div>
    );
}

export default ReportPage;
