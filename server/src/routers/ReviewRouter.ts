import { Router, Request, Response } from 'express';
import { addReviewForUser, ReviewByID } from '@server/static/ReviewStatic';

const router = Router();

// Get reviews by ID
router.get('/reviews/:reviewId', (req: Request, res: Response) => {
    const result = ReviewByID(parseInt(req.params.reviewId));
    res.status(result.success ? 200 : 404).send(result.review);
});

// Add a review for a user
router.post('/user/:userId/review', (req: Request, res: Response) => {
    const result = addReviewForUser(parseInt(req.params.userId), req.body);
    res.status(result.success ? 201 : 400).send(result.review);
});

export default router;
