import { useAuth } from '@client/context/AuthContext';

function BannedPage() {
  const { user } = useAuth();
  
  const suspension = user.primaryUserInfo.suspension;
  const startDate = new Date(suspension.startDate);
  const endDate = new Date(suspension.endDate);
  const reason = suspension.reason;
  const isIndefinite = endDate.getFullYear() > 4000; 


  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <div className='container'>
      <h1>Account Suspended</h1>
      <p>Your account has been suspended due to violations of our community guidelines.</p>
      {isIndefinite ? (
        <p>Your account is suspended indefinitely.</p>
      ) : (
        <p>Your ban started on {formatDate(startDate)} and will last until {formatDate(endDate)}.</p>
      )}
      <p>Reason for ban: {reason}</p>
    </div>
  );
}

export default BannedPage;