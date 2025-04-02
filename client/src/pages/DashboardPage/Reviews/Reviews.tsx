import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import styles from "@client/pages/DashboardPage/Reviews/Reviews.module.css";
import dashboardStyles from "@client/pages/DashboardPage/Dashboard.module.css";
import { useAuth } from "@client/context/AuthContext";
import { IReview } from "@gofetch/models/IReview";
import { getUserByIdWithPictures } from "@client/services/UserRegistry";
import defaultProfile from "@client/assets/images/default-profile-picture.svg";
import { Link } from "react-router-dom";

function Reviews() {
  const { user } = useAuth();
  const [sortedReviews, setSortedReviews] = useState<any[]>([]);
  const [reviewers, setReviewers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviewers = async () => {
      const reviewersData = await Promise.all(
        user.minderRoleInfo.reviews.map(async (review: IReview) => {
          return await getUserByIdWithPictures(review.reviewerId);
        })
      );

      setReviewers(reviewersData);
      setLoading(false);
    };

    setSortedReviews(
      [...user.minderRoleInfo.reviews].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    );

    fetchReviewers();
  }, [user.minderRoleInfo.reviews]);

  const percentages = [5, 4, 3, 2, 1].map((rating) => {
    return Math.round(
      (user.minderRoleInfo.reviews.filter(
        (review: IReview) => review.rating === rating
      ).length /
        user.minderRoleInfo.reviews.length) *
        100
    );
  });

  return (
    <div className={dashboardStyles.dashboardSection}>
      <h2>Your Reviews</h2>
      <p>See what pet owners are saying about your services.</p>
      <div className={styles.reviewsBreakdown}>
        <div className={styles.reviewScore}>
          <h1>{user.minderRoleInfo.rating.toFixed(1)}</h1>
        </div>
        <div className={styles.breakdownText}>
          <h5>Overall Rating</h5>
          <div className={styles.starRating}>
            {[1, 2, 3, 4, 5].map((rating) => {
              return (
                <Star
                  key={rating}
                  size={24}
                  className={
                    user.minderRoleInfo.rating + 0.5 >= rating
                      ? styles.solidStar
                      : ""
                  }
                />
              );
            })}
          </div>
          <p>
            Based on {user.minderRoleInfo.reviews.length} review
            {user.minderRoleInfo.reviews.length === 1 ? "" : "s"}
          </p>
        </div>
        {user.minderRoleInfo.reviews.length > 0 && (
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
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.reviewsList}>
          {user.minderRoleInfo.reviews.length > 0 ? (
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
                          key={rating}
                          size={18}
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
      )}
    </div>
  );
}

export default Reviews;
