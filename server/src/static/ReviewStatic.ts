import { IReview } from '@gofetch/models/IReview';
import { addReviewCached, getCachedReviews } from '@server/services/ReviewCached';
import { cache, DB_PATH } from '@server/utils/Cache';
import { Role } from '@gofetch/models/IUser';
import fs from 'fs';

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
        .map((reviewId: any) => cache.reviews.find(review => review.id === reviewId)?.rating || 0)
        .reduce((acc: number, rating: number, _: any, arr: string | any[]) => acc + rating / arr.length, 0);

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
