import fs from 'fs';
import { IReview } from '@gofetch/models/IReview';
import { cache, DB_PATH } from '@server/services/Cache';

export function getCachedReviews(): IReview[] {
    try {
        return cache.reviews;
    }
    catch (error) {
        return [];
    }
}

export function addReviewCached(review: IReview) {
    const newId = cache.reviews.length > 0 ? cache.reviews[cache.reviews.length - 1].id + 1 + 1 : 1;
    const newReview: IReview = {
        id: newId,
        rating: review.rating,
        review: review.review,
        date: new Date(),
        reviewerId: review.reviewerId,
        revieweeId: review.revieweeId,
        bookingId: review.bookingId
    };

    cache.reviews.push(newReview);

    saveReviewsToFile(cache.reviews);

    return { success: true, message: 'Review added successfully!', review: newReview };
}

function saveReviewsToFile(reviews: IReview[]) {
    fs.writeFileSync(`${DB_PATH}/reviews.json`, JSON.stringify(reviews, null, 2), 'utf8');
}