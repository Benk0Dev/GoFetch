import { useState, useEffect, useCallback, useRef } from 'react';
import { INotification } from '@gofetch/models/INotification';
import NotificationPopup from '@client/components/Notifications/NotificationPopup';
import styles from '@client/components/Notifications/NotificationContainer.module.css';

// Import notification sound
import notificationSound from '../../assets/sounds/notification.mp3';

interface NotificationContainerProps {
  notifications: INotification[];
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({ notifications }) => {
  const [activeNotifications, setActiveNotifications] = useState<INotification[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Keep track of notifications we've already shown
  const displayedNotificationsRef = useRef<Set<number>>(new Set());

  // Initialize audio element
  useEffect(() => {
    // Create audio element directly in the DOM for better browser support
    const audio = new Audio(notificationSound);
    audio.volume = 0.2;
    audio.preload = 'auto';
    audioRef.current = audio;
    
    return () => {
      // Clean up audio element
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Check if notifications and sounds are enabled
  const getNotificationSettings = useCallback(() => {
    const notificationsEnabled = localStorage.getItem("notificationsEnabled");
    const soundEnabled = localStorage.getItem("soundEnabled");
    
    return {
      notifications: notificationsEnabled === "false" ? false : true,
      sound: soundEnabled === "false" ? false : true,
    };
  }, []);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    const { sound } = getNotificationSettings();
    if (audioRef.current && sound) {
      // Reset the audio to the beginning
      audioRef.current.currentTime = 0;

      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Notification sound played successfully');
          })
          .catch(error => {
            console.warn('Notification sound failed to play:', error);
          });
      }
    }
  }, []);

  // Check for new notifications
  useEffect(() => {
    if (notifications.length > 0) {
      // Look for unread notifications we haven't shown yet
      const newNotifications = notifications.filter(notification => 
        !notification.read && 
        !displayedNotificationsRef.current.has(notification.id) &&
        !activeNotifications.some(n => n.id === notification.id)
      );
      
      if (newNotifications.length > 0) {
        // Play sound only once for batch of new notifications
        playNotificationSound();
        
        // Add to active notifications and mark as displayed
        setActiveNotifications(prev => [...prev, ...newNotifications]);
        
        // Track these as displayed
        newNotifications.forEach(notification => {
          displayedNotificationsRef.current.add(notification.id);
        });

        console.log(`Showing ${newNotifications.length} new notifications`);
      }
    }
  }, [notifications, activeNotifications, playNotificationSound]);

  const handleCloseNotification = useCallback((notificationId: number) => {
    setActiveNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
    // Note: We don't remove from displayedNotificationsRef because we want
    // to remember that we've already shown this notification
  }, []);

  return (
    <div className={styles.container}>
      {activeNotifications.map(notification => (
        <NotificationPopup
          key={notification.id}
          notification={notification}
          onClose={() => handleCloseNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;