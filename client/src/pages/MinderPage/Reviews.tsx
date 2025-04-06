import minderPageStyles from "./MinderPage.module.css";
import styles from "@client/pages/DashboardPage/Reviews/Reviews.module.css";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import defaultProfile from "@client/assets/images/default-profile-picture.svg";
import { IReview } from "@gofetch/models/IReview";

function Reviews({ minder, sortedReviews, reviewers }: { minder: any, sortedReviews: any[], reviewers: any[] }) {

    const percentages = [5, 4, 3, 2, 1].map((rating) => {
        return Math.round(
          (minder.minderRoleInfo.reviews.filter(
            (review: IReview) => review.rating === rating
          ).length /
            minder.minderRoleInfo.reviews.length) *
            100
        );
      });

    return (
        <div className={minderPageStyles.sectionContainer}>
            <div className={minderPageStyles.subSectionContainer}>
                <h4>Reviews</h4>
                <p>Details about the pet minding services provided.</p>
                <div className={styles.reviewsBreakdown} style={{ width: "100%" }}>
                    <div className={styles.reviewScore}>
                        <h1>{minder.minderRoleInfo.rating.toFixed(1)}</h1>
                    </div>
                    <div className={styles.breakdownText}>
                        <h5>Overall Rating</h5>
                        <div className={styles.starRating}>
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <Star
                                    size={24}
                                    key={rating}
                                    className={
                                        minder.minderRoleInfo.rating + 0.5 >= rating
                                            ? styles.solidStar
                                            : ""
                                    }
                                />
                            ))}
                        </div>
                        <p>
                            Based on {minder.minderRoleInfo.reviews.length} review
                            {minder.minderRoleInfo.reviews.length === 1 ? "" : "s"}
                        </p>
                    </div>
                    {minder.minderRoleInfo.reviews.length > 0 && (
                        <div className={styles.percentageBreakdown}>
                            <p>Rating Breakdown</p>
                            {[5, 4, 3, 2, 1].map((rating, index) => {
                                return (
                                    percentages[index] > 0 && (
                                        <div className={styles.percentage} key={rating}>
                                            <span>
                                                {rating}
                                                <Star size={18} strokeWidth={2} />
                                            </span>
                                            <div className={styles.percentageBar}>
                                                <div className={styles.percentageBarBackground}>
                                                    <div
                                                        className={styles.percentageBarFill}
                                                        style={{ width: percentages[index] + "%" }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <span>{percentages[index]}%</span>
                                        </div>
                                    )
                                );
                            })}
                        </div>
                    )}
                </div>
                <div className={styles.reviewsList} style={{ width: "100%", marginBottom: "10px" }}>
                    {minder.minderRoleInfo.reviews.length > 0 ? (
                        sortedReviews.map((review: IReview) => {
                            const reviewer = reviewers.find(
                                (rev) => rev.id === review.reviewerId
                            );
                            return (
                                <div className={styles.review} key={review.id}>
                                    <div className={styles.reviewHeader}>
                                        <Link
                                            to={`/users/${reviewer.id}`}
                                            className={styles.reviewer}
                                        >
                                            <img
                                                src={
                                                    reviewer
                                                        ? reviewer.primaryUserInfo.profilePic
                                                        : defaultProfile
                                                }
                                                alt={
                                                    reviewer
                                                        ? `${reviewer.name.fname} ${reviewer.name.sname}`
                                                        : "Unknown Reviewer"
                                                }
                                            />
                                            <h6>
                                                {reviewer
                                                    ? `${reviewer.name.fname} ${reviewer.name.sname}`
                                                    : "Unknown Reviewer"}
                                            </h6>
                                        </Link>
                                        <div className={styles.starRating}>
                                            {[1, 2, 3, 4, 5].map((rating) => (
                                                <Star
                                                    size={18}
                                                    key={rating}
                                                    className={
                                                        review.rating >= rating ? styles.solidStar : ""
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p>
                                            {review.review ? review.review : "No review message."}
                                        </p>
                                        <p className={styles.date}>
                                            {new Date(review.date).toLocaleDateString("en-GB")}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>No reviews available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Reviews;
