import { useState, useEffect, useCallback, useRef } from 'react';
import { INotification } from '../../models/INotification';
import NotificationPopup from './NotificationPopup';
import styles from './NotificationContainer.module.css';

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

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (audioRef.current) {
      // Reset the audio to the beginning
      audioRef.current.currentTime = 0;
      
      // Create a play promise and handle any errors
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Notification sound played successfully');
          })
          .catch(error => {
            // Auto-play was prevented (common in browsers)
            console.warn('Notification sound failed to play:', error);
            
            // For browsers that require user interaction before playing audio
            // You could show a UI element here that allows users to enable sound
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