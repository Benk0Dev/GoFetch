import { IReport } from '@gofetch/models/IReport';
import styles from './Reports.module.css';

interface ReportModalProps {
  report: IReport;
  onClose: () => void;
}

function ReportsModal({ report, onClose }: ReportModalProps) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalScrollContent}>
          <div className={styles.modalHeader}>
            <h3>{report.title}</h3>
            <span className={styles.statusBadge}>
              {report.status}
            </span>
          </div>
          
          <div className={styles.reportDescription}>
            <p>{report.description}</p>
          </div>
          
          <div className={styles.modalActions}>
            <button className={`${styles.actionButton} ${styles.dangerButton}`}>
              Suspend
            </button>
            <button className={`${styles.actionButton} ${styles.dangerButton}`}>
              Ban
            </button>
            <button className={`${styles.actionButton} ${styles.dangerButton}`}>
              Warn
            </button>
            <button className={`${styles.actionButton} ${styles.dangerButton}`}>
              No Action
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsModal;