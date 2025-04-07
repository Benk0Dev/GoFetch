import { IReport } from '@gofetch/models/IReport';
import { IUser } from '@gofetch/models/IUser';
import { useEffect, useState } from 'react';
import { getUserById, suspendUser} from '@client/services/UserRegistry';
import styles from './Reports.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { startChat } from '@client/services/ChatRegistry';
import { setReportResult } from '@client/services/ReportRegistry';

interface ReportModalProps {
  report: IReport;
  onClose: () => void;
}

function ReportsModal({ report, onClose }: ReportModalProps) {
  
  const [reportingUser, setReportingUser] = useState<IUser | null>(null);
  const [reportedUser, setReportedUser] = useState<IUser | null>(null);
  const [showSuspendPrompt, setShowSuspendPrompt] = useState(false);
  const [suspendDays, setSuspendDays] = useState(1);
  const [suspendReason, setSuspendReason] = useState('');
  const [banReason, setBanReason] = useState('');
  const [showBanPrompt, setShowBanPrompt] = useState(false);

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

  // Function to handle the warning action
  const handleWarning = async () => {
      try {
          const chat = await startChat(Number(report.reporteeId));
          navigate(`/chats/${chat.id}`);
          if (chat) {
            setReportResult(report.id, 'Warning');
          }
        } catch (error) {
          console.error('Error issuing warning:', error);
        }
      onClose();
    };

  // Function to handle the no action button
  const handleNoAction = async () => {
    try {
      const result = await setReportResult(report.id, 'No Action');
      if (result) {
        alert('No action taken on the report');
        onClose();
      } else {
        alert('Failed to update report result');
      }
    } catch (error) {
      console.error('Error updating report result:', error);
    }
  };

  // Function to handle the suspension action
  const handleSuspend = async () => {
    try {
      const suspensionData = {
        userId: report.reporteeId,
        reason: suspendReason, 
        duration: suspendDays
      };
  
      const success = await suspendUser(report.reporteeId, suspensionData);
      
      if (success) {
        setReportResult(report.id, 'Suspended');
        alert(`User suspended for ${suspendDays} days`);
        setShowSuspendPrompt(false);
        onClose();
      } else {
        alert('Suspension failed');
      }
    } catch (error) {
      console.error('Suspension error:', error);
    }
  };

  // Function to handle the ban action
  const handleBan = async () => {
    try {
      const banData = {
        userId: report.reporteeId,
        duration: 1000000, // Indefinite ban
        reason: banReason,
      };
  
      const success = await suspendUser(report.reporteeId, banData);
      
      if (success) {
        setReportResult(report.id, 'Banned');
        setShowBanPrompt(false);
        alert('User banned successfully');
        onClose();
      } else {
        alert('Ban failed');
      }
    } catch (error) {
      console.error('Ban error:', error);
    }
  }
  


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
              <Link to={`/users/${report.reporterId}`} className={styles.userLink}>
                <p><strong>{reportingUser?.name.fname} {reportingUser?.name.sname}</strong></p>
              </Link>
              <p>User ID: {report.reporterId}</p>
              <p>Report Created: {new Date(report.createdAt).toLocaleDateString()}</p>
            </div>
            
            <div className={styles.userColumn}>
              <h4>Reported User</h4>
              <Link to={`/users/${report.reporteeId}`} className={styles.userLink}>
                <p><strong>{reportedUser?.name.fname} {reportedUser?.name.sname}</strong></p>
              </Link>
              <p>Email: {reportedUser?.loginDetails.email}</p> 
              <p>Rating: {reportedUser?.minderRoleInfo.rating}</p>
            </div>
          </div>
          
          <div className={styles.actionSection}>
            <h4>Take Action</h4>
            <div className={styles.actionButtons}>
              <button className={`${styles.actionButton} ${styles.dangerButton}`}
                onClick={() => setShowBanPrompt(!showBanPrompt)}
                >
                Ban User
              </button>
              <button 
                className={`${styles.actionButton} ${styles.dangerButton}`}
                onClick={() => setShowSuspendPrompt(!showSuspendPrompt)}
              >
                Suspend User
              </button>
              <button className={`${styles.actionButton} ${styles.dangerButton}`} onClick={handleWarning}>
                Issue Warning
              </button>
              <button className={`${styles.actionButton} ${styles.dangerButton}`} onClick={handleNoAction}>
                No Action
              </button>
            </div>
          </div>
          {showSuspendPrompt && (
            <div className={styles.suspendPrompt}>
              <h4>Enter Suspension Details</h4>
              <div className={styles.suspendForm}>
                <label>
                  Duration (days):
                  <input
                  type="text"
                  value={suspendDays}
                  onChange={(e) => {
                    // Only allow numbers
                    const numValue = e.target.value.replace(/[^0-9]/g, '');
                    setSuspendDays(numValue ? parseInt(numValue) : 0);
                  }}
                  className={styles.suspendInput}
                />
                </label>
                <label>
                  Reason:
                  <textarea 
                    value={suspendReason} 
                    onChange={(e) => setSuspendReason(e.target.value)}
                    className={styles.suspendTextarea}
                    placeholder="Enter suspension reason..."
                  />
                </label>
                <button 
                  onClick={handleSuspend}
                  className={styles.suspendConfirmButton}
                  disabled={suspendDays <= 0}
                >
                  Confirm Suspension
                </button>
              </div>
            </div>
          )}
          {showBanPrompt && (
            <div className={styles.suspendPrompt}>
              <h4>Enter Ban Details</h4>
              <div className={styles.suspendForm}>
                <label>
                  Reason:
                  <textarea 
                    value={banReason} 
                    onChange={(e) => setBanReason(e.target.value)}
                    className={styles.suspendTextarea}
                    placeholder="Enter ban reason..."
                  />
                </label>
                <button 
                  onClick={handleBan}
                  className={styles.suspendConfirmButton}
                >
                  Confirm Suspension
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ReportsModal;