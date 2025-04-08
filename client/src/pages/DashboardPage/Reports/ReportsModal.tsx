import { IReport } from '@gofetch/models/IReport';
import { IUser } from '@gofetch/models/IUser';
import { useEffect, useState } from 'react';
import { getUserById, suspendUser} from '@client/services/UserRegistry';
import styles from './Reports.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { startChat } from '@client/services/ChatRegistry';
import { setReportResult } from '@client/services/ReportRegistry';
import { Ban, MessageSquareWarning, Check, Clock } from "lucide-react";

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
          if (confirm('By issuing a warning, you are notifying the user about their behavior. Continuing will immediately set this report as handled.\n\nDo you want to proceed?')) {
            const chat = await startChat(Number(report.reporteeId));
            navigate(`/chats/${chat.id}`);
            if (chat) {
              setReportResult(report.id, 'Warning');
            }
          } else {
            return;
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
        duration: null, // Indefinite ban
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
          <h3>Report Details</h3>
          <div className={styles.reportInfoSection}>
            <h6>Title</h6>
            <p>{report.title}</p>
          </div>
          <div className={styles.reportInfoSection}>
            <h6>Description</h6>
            <p>{report.description}</p>
          </div>
          <div className={styles.userInfoSection}>
            <h6>Reported User</h6>
            <div>
              <Link to={`/users/${report.reporteeId}`} className="btn-link">
                <h5>{reportedUser?.name.fname} {reportedUser?.name.sname}</h5>
              </Link>
              <p><strong>Email:</strong> {reportedUser?.loginDetails.email}</p>
            </div>
          </div>
          <div className={styles.userInfoSection}>
            <h6>Reporting User</h6>
            <div> 
              <Link to={`/users/${report.reporterId}`} className="btn-link">
                <h5>{reportingUser?.name.fname} {reportingUser?.name.sname}</h5>
              </Link>
              <p><strong>Email:</strong> {reportingUser?.loginDetails.email}</p>
            </div>
          </div>
          <div className={styles.actionSection}>
            <h6>Actions</h6>
            <div className={styles.actionButtons}>
              <button className={`btn btn-primary ${styles.dangerButton}`}
                onClick={() => {setShowBanPrompt(!showBanPrompt);
                  setShowSuspendPrompt(false);
                } }
                >
                <Ban size={16} />Ban User
              </button>
              <button 
                className={`btn btn-primary ${styles.dangerButton}`}
                onClick={() => {
                  setShowSuspendPrompt(!showSuspendPrompt);
                  setShowBanPrompt(false);
                } }
              >
                <Clock size={16} />Suspend User
              </button>
              <button className={`btn btn-secondary ${styles.dangerButton}`} onClick={handleWarning}>
              <MessageSquareWarning size={16} />Issue Warning
              </button>
              <button className={`btn btn-secondary ${styles.dangerButton}`} onClick={handleNoAction}>
                <Check size={16} />No Action
              </button>
            </div>
          </div>
          {showSuspendPrompt && (
            <div className={styles.suspendPrompt}>
              <h4>Suspension Details</h4>
              <p>This will temporarily suspend the user's account.</p>
              <div className={styles.suspendForm}>
                <label>
                  Duration (days):
                  <input
                  type="number"
                  value={suspendDays}
                  onChange={(e) => setSuspendDays(Number(e.target.value))}
                  min="1"
                  className={styles.suspendInput}
                />
                </label>
                <label>
                  Reason:
                  <textarea 
                    value={suspendReason} 
                    onChange={(e) => setSuspendReason(e.target.value)}
                    className={styles.suspendTextarea}
                    placeholder="Add a note explaning your decision..."
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
              <h4>Ban Details</h4>
              <p>This will permanently ban the user from the platform.</p>
              <div className={styles.suspendForm}>
                <label>
                  Reason:
                  <textarea 
                    value={banReason} 
                    onChange={(e) => setBanReason(e.target.value)}
                    className={styles.suspendTextarea}
                    placeholder="Add a note explaning your decision..."
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