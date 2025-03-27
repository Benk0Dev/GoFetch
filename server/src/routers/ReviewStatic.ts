import { IReview } from '../models/IReview';
import { addReviewCached, getCachedReviews } from '../services/ReviewCached';
import { cache } from '../services/Cache';
import { DB_PATH } from '../services/Cache';
import fs from 'fs';
import { Role } from '../models/IUser';

export function ReviewByID(reviewId: number) {
    const review = cache.reviews.find(review => review.id === reviewId);
    if (review) {
        return { success: true, review };
    }
    return { success: false, message: 'Review not found' };
}

export function addReviewForUser(userId: number, review: IReview) {
    const userIndex = cache.users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
        return { success: false, message: 'User not found' };
    }

    if (!cache.users[userIndex].roles.includes(Role.MINDER)) {
        return { success: false, message: 'User is not a pet minder' };
    }

    const newReview = addReviewCached(review).review;

    cache.users[userIndex].minderRoleInfo.reviewIds.push(newReview.id);

    const updatedRating = cache.users[userIndex].minderRoleInfo.reviewIds
        .map(reviewId => cache.reviews.find(review => review.id === reviewId)?.rating || 0)
        .reduce((acc, rating, _, arr) => acc + rating / arr.length, 0);

    cache.users[userIndex].minderRoleInfo.rating = updatedRating;

    try {
        fs.writeFileSync(`${DB_PATH}/reviews.json`, JSON.stringify(cache.reviews, null, 2), 'utf8');
        fs.writeFileSync(`${DB_PATH}/users.json`, JSON.stringify(cache.users, null, 2), 'utf8');
        return { success: true, message: 'Review added successfully', review: newReview };
    } catch (error) {
        console.error('Error adding review for user:', error);
        return { success: false, message: 'Error adding review' };
    }
}
