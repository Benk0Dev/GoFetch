import { IReport } from '@gofetch/models/IReport';
import { IUser } from '@gofetch/models/IUser';
import { useEffect, useState } from 'react';
import { getUserById } from '@client/services/UserRegistry';
import styles from './Reports.module.css';
import { useNavigate } from 'react-router-dom';
import { startChat } from '@client/services/ChatRegistry';

interface ReportModalProps {
  report: IReport;
  onClose: () => void;
}

function ReportsModal({ report, onClose }: ReportModalProps) {
  
  const [reportingUser, setReportingUser] = useState<IUser | null>(null);
  const [reportedUser, setReportedUser] = useState<IUser | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const reporter = await getUserById(report.reporterId);
        const reportee = await getUserById(report.reporteeId);
        
        setReportingUser(reporter);
        setReportedUser(reportee);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [report.reporterId, report.reporteeId]);

  const handleWarning = async () => {
          const chat = await startChat(Number(report.reporteeId));
          navigate(`/chats/${chat.id}`);
    };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalScrollContent}>
          <div className={styles.modalHeader}>
            <h3>Report Details</h3>
            <span className={styles.statusBadge}>
              {report.status}
            </span>
          </div>

          <div className={styles.reportSection}>
            <h4>Title:</h4>
            <p>{report.title}</p>
          </div>
          
          <div className={styles.reportSection}>
            <h4>Description:</h4>
            <p>{report.description}</p>
          </div>
          
          <div className={styles.userInfoSection}>
            <div className={styles.userColumn}>
              <h4>Reporting User</h4>
              <p><strong>{reportingUser?.name.fname} {reportingUser?.name.sname}</strong></p>
              <p>User ID: {report.reporterId}</p>
              <p>Report Created: {new Date(report.createdAt).toLocaleDateString()}</p>
            </div>
            
            <div className={styles.userColumn}>
              <h4>Reported User</h4>
              <p><strong>{reportedUser?.name.fname} {reportedUser?.name.sname}</strong></p>
              <p>Email: {reportedUser?.loginDetails.email}</p> 
              <p>Rating: {reportedUser?.minderRoleInfo.rating}</p>
            </div>
          </div>
          
          <div className={styles.actionSection}>
            <h4>Take Action</h4>
            <div className={styles.actionButtons}>
              <button className={`${styles.actionButton} ${styles.dangerButton}`}>
                Ban User
              </button>
              <button className={`${styles.actionButton} ${styles.dangerButton}`}>
                Suspend User
              </button>
              <button className={`${styles.actionButton} ${styles.dangerButton}`} onClick={handleWarning}>
                Issue Warning
              </button>
              <button className={`${styles.actionButton} ${styles.dangerButton}`}>
                No Action
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsModal;