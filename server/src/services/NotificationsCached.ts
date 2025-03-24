import { INotification } from '../models/INotification';
import { cache, DB_PATH } from './Cache';
import fs from 'fs';
import path from 'path';

// Initialize cache for notifications if not present
if (!cache.notifications) {
    try {
        const notificationsData = fs.readFileSync(path.join(DB_PATH, 'notifications.json'), 'utf8');
        const parsed = JSON.parse(notificationsData);
        cache.notifications = parsed.notifications || [];
    } catch (error) {
        console.error('Error loading notifications data:', error);
        cache.notifications = [];

        // Create initial notifications.json file if it doesn't exist
        saveNotificationsToFile();
    }
}

export function getNotificationsForUserCached(userId: number): INotification[] {
    return cache.notifications.filter(notification => notification.userId === userId);
}

export function markNotificationAsReadCached(notificationId: number): INotification | null {
    const notification = cache.notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        notification.updatedAt = new Date();

        // Save to file
        saveNotificationsToFile();

        return notification;
    }
    return null;
}

export function addNotificationCached(notificationData: Omit<INotification, 'id' | 'createdAt' | 'updatedAt' | 'read'>): INotification {
    // Create new notification with ID
    const newId = cache.notifications.length > 0 ? Math.max(...cache.notifications.map(n => n.id)) + 1 : 1;

    const now = new Date();
    const newNotification: INotification = {
        id: newId,
        ...notificationData,
        read: false,
        createdAt: now,
        updatedAt: now
    };

    // Add to notifications array
    cache.notifications.push(newNotification);

    // Save to file
    saveNotificationsToFile();

    return newNotification;
}

function saveNotificationsToFile() {
    try {
        fs.writeFileSync(
            path.join(DB_PATH, 'notifications.json'),
            JSON.stringify({
                notifications: cache.notifications
            }, null, 2),
            'utf8'
        );
    } catch (error) {
        console.error('Error saving notifications data:', error);
    }
}