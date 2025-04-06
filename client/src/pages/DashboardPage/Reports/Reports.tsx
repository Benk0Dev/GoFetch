import styles from './Reports.module.css';
import dashboardStyles from '@client/pages/DashboardPage/Dashboard.module.css';
import { useEffect, useState } from 'react';
import { getAllReports } from '@client/services/ReportRegistry';
import { IReport } from '@gofetch/models/IReport';
import '@client/global.css';
import ReportsModal from './ReportsModal';

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
            <p>View reports created by users.</p>
            <div className='container'>
                <div className={styles.reportsList}>
                    {reports.length === 0 ? (
                        <p>No reports found</p>
                    ) : (
                        <table className={styles.reportsTable}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Reported User ID</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map(report => (
                                    <tr key={report.id}>
                                        <td>{report.id}</td>
                                        <td>{report.title}</td>
                                        <td>{report.reporteeId}</td>
                                        <td>{report.status}</td>
                                        <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <button className="btn2 btn-primary" onClick={() => setSelectedReport(report)}>More</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {selectedReport && (
                    <ReportsModal
                    report={selectedReport}
                    onClose={() => setSelectedReport(null)}
                    />
                )}
            </div>
        </div>
    );
}

export default Reports;