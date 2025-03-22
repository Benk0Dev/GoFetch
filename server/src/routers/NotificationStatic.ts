import { INotification } from '../models/INotification';
import { getNotificationsForUserCached, markNotificationAsReadCached, addNotificationCached } from '../services/NotificationsCached';

export function getNotificationsForUser(userId: number) {
    return { success: true, notifications: getNotificationsForUserCached(userId) };
}

export function markNotificationAsRead(notificationId: number) {
    return { success: true, notification: markNotificationAsReadCached(notificationId) };
}

export function addNotification(notification: Omit<INotification, 'id' | 'createdAt' | 'updatedAt' | 'read'>) {
    return { success: true, notification: addNotificationCached(notification) };
}