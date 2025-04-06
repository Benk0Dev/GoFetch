import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from '@client/components/Notifications/NotificationPopup.module.css';
import { INotification, NotificationType } from '@gofetch/models/INotification';
import { markNotificationAsRead } from '@client/services/NotificationRegistry';

interface NotificationPopupProps {
  notification: INotification;
  onClose: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ notification, onClose }) => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const animationDuration = 5000; // 5 seconds

  useEffect(() => {
    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, animationDuration);

    // Start slide-out animation after 4.5 seconds
    const animationTimer = setTimeout(() => {
      setIsExiting(true);
    }, animationDuration - 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(animationTimer);
    };
  }, [onClose]);

  const handleClick = async () => {
    // Mark as read
    await markNotificationAsRead(notification.id);
    
    // Navigate based on notification type
    switch (notification.type) {
      case NotificationType.Message:
        navigate(`/chats/${notification.linkId}`);
        break;
      case NotificationType.Booking:
        navigate(`/dashboard/bookings/${notification.linkId}`);
        break;
      case NotificationType.Review:
        navigate(`/dashboard/reviews`);
        break;
      default:
        navigate('/dashboard');
    }
    
    onClose();
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExiting(true);
    // Delay actual closing to allow animation to play
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div 
      className={`${styles.popup} ${isExiting ? styles.exit : ''}`} 
      onClick={handleClick}
    >
      <div className={styles.popup} onClick={handleClick}>
        <div className={styles.header}>
          <h4>New Notification</h4>
          <button className={styles.closeBtn} onClick={handleClose}>
            <X size={18} />
          </button>
        </div>
        <div className={styles.content}>
          <p>{notification.message}</p>
        </div>
        <div className={styles.footer}>
          <span className={styles.time}>
            {new Date(notification.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}{', '}
            {new Date(notification.createdAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;