export interface IReview {
    id: number;
    rating: number;
    review: string;
    date: Date;
    reviewerId: number;
    revieweeId: number;
}