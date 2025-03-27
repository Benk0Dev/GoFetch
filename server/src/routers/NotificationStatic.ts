import { INotification } from '../models/INotification';
import { getNotificationsForUserCached, markNotificationAsReadCached, addNotificationCached } from '../services/NotificationsCached';
import { io } from '../server/httpServer';

export function getNotificationsForUser(userId: number) {
    return { success: true, notifications: getNotificationsForUserCached(userId) };
}

export function markNotificationAsRead(notificationId: number) {
    const notification = markNotificationAsReadCached(notificationId);
    return { success: true, notification };
}

export function addNotification(notification: Omit<INotification, 'id' | 'createdAt' | 'updatedAt' | 'read'>) {
    const newNotification = addNotificationCached(notification);
    
    // Emit the notification to the user's room
    io.to(`user-${notification.userId}`).emit('new-notification', newNotification);
    
    return { success: true, notification: newNotification };
}