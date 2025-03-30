import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IUser } from "@gofetch/models/IUser";
import { getUserByIdWithPictures, getUserById } from "@client/services/UserRegistry";
import { startChat } from "@client/services/ChatRegistry";
import styles from "./viewProfile.module.css";
import { MapPin, Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { IReview } from "@gofetch/models/IReview";

// This component is responsible for displaying the profile of a specific minder.
const ViewProfile = () => {
  const { minderId } = useParams<{ minderId: string }>();

  const [minder, setMinder] = useState<IUser | null>(null);
  const [selectedTab, setSelectedTab] = useState("about"); // New: tab state
  const [reviews, setReviews] = useState<
    (IReview & { reviewerName?: string; reviewerPic?: string })[]
  >([]);

  const navigate = useNavigate();

  const { user } = useAuth();

  const handleBooking = (event: React.MouseEvent) => {
    if (!user) {
      navigate("/login");
    } else {
      if (minder) {
        navigate("/booking", { state: { minderId: minder.id } });
      }
    }
  };

  // Fetch the minder data when the component mounts or when minderId changes
  // 1️⃣ Fetch minder data and preserve reviewIds
  useEffect(() => {
    const fetchMinderData = async () => {
      if (minderId) {
        const id = parseInt(minderId);
        if (!isNaN(id)) {
          // Step 1: Get raw user (contains reviewIds)
          const rawUser = await getUserById(id);
          const reviewIds = rawUser?.minderRoleInfo?.reviewIds || [];

          // Step 2: Get user with pictures
          const userData = await getUserByIdWithPictures(id);

          // Reattach reviewIds if lost
          if (userData?.minderRoleInfo) {
            userData.minderRoleInfo.reviewIds = reviewIds;
          }

          setMinder(userData);
        }
      }
    };

    fetchMinderData();
  }, [minderId]);

  // 2️⃣ Once minder is loaded, fetch reviews
  // 2️⃣ Once minder is loaded, fetch reviews and reviewer details
  useEffect(() => {
    const fetchReviewsWithReviewers = async () => {
      if (!minder || !minder.minderRoleInfo?.reviews) return;

      const reviews = minder.minderRoleInfo.reviews;

      // Fetch reviewer info for each review
      const reviewsWithReviewer = await Promise.all(
        reviews.map(async (review) => {
          const reviewer = await getUserByIdWithPictures(review.reviewerId);
          return {
            ...review,
            reviewerName: `${reviewer.name.fname} ${reviewer.name.sname}`,
            reviewerPic: reviewer.primaryUserInfo.profilePic,
          };
        })
      );

      setReviews(reviewsWithReviewer);
    };

    if (minder) {
      fetchReviewsWithReviewers();
    }
  }, [minder]);

  // Handle the message button click
  const handleMessage = async () => {
    if (!user) {
      navigate("/login");
    } else {
      if (minder) {
        const chat = await startChat(Number(minderId));
        navigate(`/chats/${chat.id}`);
      }
    }
  };

  if (!minder) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles["minder-profile"]}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        ← Back to Browse
      </button>

      <div className={styles["profile-main-content"]}>
        <div className={styles["profile-left"]}>
          <div className={styles["minder-header"]}>
            <div className={styles["profile-info"]}>
              <img
                src={
                  minder.primaryUserInfo.profilePic ||
                  "/path/to/default/profile.jpg"
                }
                alt={`${minder.name.fname} ${minder.name.sname}`}
                className={styles["profile-pic"]}
              />
              <div className={styles["minder-info"]}>
                <h1>
                  {minder.name.fname} {minder.name.sname}
                </h1>
                <p className={styles["location"]}>
                  <MapPin />
                  {minder.primaryUserInfo.address.city}{" "}
                </p>
                <p className={styles["rating"]}>
                  <Star /> {parseFloat(minder.minderRoleInfo.rating.toFixed(1))}{" "}
                  / 5
                </p>
              </div>
            </div>
            <div className={styles["actions"]}>
              <button
                className={styles["btn"] + " " + styles["message-btn"]}
                onClick={handleMessage}
              >
                Message
              </button>
              <button
                className={styles["btn"] + " " + styles["book-btn"]}
                onClick={handleBooking}
              >
                Book Now
              </button>
            </div>
          </div>

          <div className={styles["profile-tabs"]}>
            <button
              className={`${styles["tab"]} ${
                selectedTab === "about" ? styles["active"] : ""
              }`}
              onClick={() => setSelectedTab("about")}
            >
              About
            </button>
            <button
              className={`${styles["tab"]} ${
                selectedTab === "services" ? styles["active"] : ""
              }`}
              onClick={() => setSelectedTab("services")}
            >
              Services
            </button>
            <button
              className={`${styles["tab"]} ${
                selectedTab === "reviews" ? styles["active"] : ""
              }`}
              onClick={() => setSelectedTab("reviews")}
            >
              Reviews
            </button>
          </div>

          {selectedTab === "about" && (
            <div className={styles["tab-content"]}>
              <h2>
                About {minder.name.fname} {minder.name.sname}
              </h2>
              <p className={styles["bio"]}>{minder.minderRoleInfo.bio}</p>

              <div className={styles["availability-section"]}>
                <h3>Availability</h3>
                <div className={styles["availability-bubbles"]}>
                  {minder.minderRoleInfo.availability
                    .split(/[\s,]+/)
                    .map((day, index) => (
                      <span
                        key={index}
                        className={styles["availability-bubble"]}
                      >
                        {day}
                      </span>
                    ))}
                </div>
              </div>

              {minder.minderRoleInfo.pictures?.length > 0 && (
                <div className={styles.galleryContainer}>
                  <h3>Gallery</h3>
                  <p>Photos from previous pet minding sessions.</p>
                  <div className={styles.galleryGrid}>
                    {minder.minderRoleInfo.pictures
                      .filter((url) => url)
                      .map((url, index) => (
                        <div key={index} className={styles.galleryItem}>
                          <img src={url} alt={`Minding session ${index + 1}`} />
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedTab === "services" && (
            <div className={styles["tab-content"]}>
              <h2>Services Offered</h2>
              <p>Details about the pet minding services provided.</p>

              <div className={styles["services-wrapper"]}>
                {minder.minderRoleInfo?.services?.length ?? 0 > 0 ? (
                  minder.minderRoleInfo.services?.map((service, index) => (
                    <div key={index} className={styles["service-card"]}>
                      <div className={styles["service-header"]}>
                        <h3>{service.type.replace(/_/g, " ")}</h3>
                        <span className={styles["service-price"]}>
                          £{service.price}
                        </span>
                      </div>
                      <p className={styles["service-duration"]}>
                        {service.duration}
                      </p>
                      <button
                        className={styles["book-service-btn"]}
                        onClick={handleBooking}
                      >
                        Book This Service
                      </button>
                    </div>
                  ))
                ) : (
                  <p>This minder has not added any services yet.</p>
                )}
              </div>
            </div>
          )}

          {selectedTab === "reviews" && (
            <div className={styles["tab-content"]}>
              <h2>Reviews</h2>
              <p>What pet owners are saying about this minder.</p>
              <div className={styles["reviews-section"]}>
                {reviews.length > 0 ? (
                  reviews.map((review, index) => {
                    const formattedDate = new Date(
                      review.date
                    ).toLocaleDateString("en-GB");
                    return (
                      <div key={index} className={styles.reviewCard}>
                        <div className={styles.reviewHeader}>
                          <img
                            src={review.reviewerPic || "/default-profile.svg"}
                            alt={review.reviewerName || "Reviewer"}
                            className={styles.reviewerPic}
                          />
                          <div className={styles.reviewerInfo}>
                            <h4 className={styles.reviewerName}>
                              {review.reviewerName || "Reviewer"}
                            </h4>
                            <span className={styles.reviewDate}>
                              {formattedDate}
                            </span>
                          </div>
                          <div className={styles.reviewStars}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={20}
                                strokeWidth={2}
                                className={
                                  review.rating >= star
                                    ? styles.starFilled
                                    : styles.starEmpty
                                }
                              />
                            ))}
                          </div>
                        </div>
                        <div className={styles.reviewContent}>
                          <p className={styles.reviewText}>
                            {review.review
                              ? review.review
                              : "No written feedback provided."}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No reviews available for this minder.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 📌 Sidebar: Book a Service */}
        <aside className={styles["book-sidebar"]}>
          <h2>Book a Service</h2>
          <p>Select a service to book with {minder.name.fname}.</p>
          {minder.minderRoleInfo?.services?.map((service, index) => (
            <div key={index} className={styles["sidebar-service"]}>
              <div className={styles["sidebar-service-header"]}>
                <span>{service.type.replace(/_/g, " ")}</span>
                <span>£{service.price}</span>
              </div>
              <p className={styles["sidebar-duration"]}>
                ⏱ {service.duration} minutes
              </p>
              <button
                className={styles["sidebar-book-btn"]}
                onClick={handleBooking}
              >
                Book Now
              </button>
              <button
                className={styles["sidebar-message-btn"]}
                onClick={handleMessage}
              >
                Message
              </button>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default ViewProfile;
