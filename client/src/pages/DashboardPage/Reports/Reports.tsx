import styles from './Reports.module.css';
import dashboardStyles from '@client/pages/DashboardPage/Dashboard.module.css';
import { useEffect, useState } from 'react';
import { getAllReports } from '@client/services/ReportRegistry';
import { IReport, Status } from '@gofetch/models/IReport';
import ReportsModal from './ReportsModal';
import { Eye } from "lucide-react";

function Reports() {
    const [reports, setReports] = useState<IReport[]>([]);
    const [selectedReport, setSelectedReport] = useState<IReport | null>(null);
    
    useEffect(() => {
        const loadReports = async () => {
            try {
                const data = await getAllReports();
                setReports(data);
            } catch (error) {
                console.error("Failed to load reports:", error);
            } 
        }
        loadReports();
    }, []);

    return (
        <div className={dashboardStyles.dashboardSection}>
            <h2>Reports</h2>
            <p>View unresolved reports created by users.</p>
            <div className={styles.reportsTable}>
                <div className={styles.reportsTableHeader}>
                    <div>ID</div>
                    <div>Reportee ID</div>
                    <div>Title</div>
                    <div>Date</div>
                    <div>Actions</div>
                </div>
                {reports
                    .filter(report => report.status === Status.PENDING)
                    .map(report => (
                        <div key={report.id} className={styles.reportsTableRow}>
                            <div className={styles.columnData}>#{report.id}</div>
                            <div className={styles.columnData}>{report.reporteeId}</div>
                            <div className={styles.columnData}>{report.title}</div>
                            <div className={styles.columnData}>{new Date(report.createdAt).toLocaleDateString()}</div>
                            <button className={`btn-link ${styles.action}`} onClick={() => setSelectedReport(report)} style={{display: "flex", alignItems: "center", gap: "5px"}}>
                                <Eye size={16} />View
                            </button>
                        </div>
                    ))}
            </div>
            {selectedReport && (
                <ReportsModal
                report={selectedReport}
                onClose={() => setSelectedReport(null)}
                />
            )}
        </div>
    );
}

export default Reports;
