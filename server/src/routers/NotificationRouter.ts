import { Router, Request, Response } from 'express';
import { getNotificationsForUser, markNotificationAsRead, addNotification } from '@server/static/NotificationStatic';

const router = Router();

// Get notifications for a user
router.get('/notifications/:userId', (req: Request, res: Response) => {
    res.json(getNotificationsForUser(parseInt(req.params.userId)));
});

// Mark a notification as read
router.put('/notifications/:notificationId/read', (req: Request, res: Response) => {
    res.json(markNotificationAsRead(parseInt(req.params.notificationId)));
});

// Add a new notification
router.post('/notifications', (req: Request, res: Response) => {
    res.json(addNotification(req.body));
});

export default router;
