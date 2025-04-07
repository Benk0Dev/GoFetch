import { useAuth } from '@client/context/AuthContext';
import styles from "./SuspendedPage.module.css";

function BannedPage() {
  const { user } = useAuth();
  
  const suspension = user.primaryUserInfo.suspension;
  const endDate = new Date(suspension.endDate);
  const reason = suspension.reason;
  const isIndefinite = endDate === null; 


  const formatDate = (date: Date) => {
    return date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) + ", " +
    date.toLocaleString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }) + " GMT";
  };

  return (
    <div className='container' style={{padding: "40px 20px"}}>
      <div className={styles.suspendedPage}>
        {isIndefinite ? (
          <>  
             <h2>Account Banned</h2>
             <p>Your account has been permanently banned.</p>
          </>
        ) : (
          <>
            <h2>Account Suspended</h2>
            <p>Your account has been suspended until {formatDate(endDate)}.</p>
          </>
        )}
        <p>Reason for {isIndefinite ? "ban" : "suspension"}: {reason ? reason : "N/A"}</p>
      </div>
    </div>
  );
}

export default BannedPage;