import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { IUser, Role } from "@gofetch/models/IUser";
import { getUserByIdWithPictures } from "@client/services/UserRegistry";
import { startChat } from "@client/services/ChatRegistry";
import styles from "./MinderPage.module.css";
import { MapPin, Star, MessageSquare } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { IReview } from "@gofetch/models/IReview";
import BackButton from "@client/components/BackButton";
import About from "./About";
import Services from "./Services";
import Reviews from "./Reviews";
import { IService } from "@gofetch/models/IService";
import {
  getDistanceBetweenAddresses,
  loadGooglePlacesScript,
} from "@client/services/googleApi";

const MinderPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { minderId } = useParams<{ minderId: string }>();
  const [minder, setMinder] = useState<IUser | null>(null);
  const [sortedReviews, setSortedReviews] = useState<any[]>([]);
  const [reviewers, setReviewers] = useState<any[]>([]);
  const [distance, setDistance] = useState<string>("Loading...");
  const [loading, setLoading] = useState(true);

  const [selectedTab, setSelectedTab] = useState("about");

  useEffect(() => {
    const initialize = async () => {
      const minder = await getUserByIdWithPictures(Number(minderId));
      if (!minder) {
        setLoading(false);
        return;
      }

      const reviewersData = await Promise.all(
        minder.minderRoleInfo.reviews.map(async (review: IReview) => {
          return await getUserByIdWithPictures(review.reviewerId);
        })
      );

      setMinder(minder);
      setReviewers(reviewersData);
      setSortedReviews(
        [...minder.minderRoleInfo.reviews].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );

      // Load distance if user exists
      if (user) {
        try {
          await loadGooglePlacesScript();
          const distInMeters = await getDistanceBetweenAddresses(
            user.primaryUserInfo.address,
            minder.primaryUserInfo.address
          );
          const distInMiles = (distInMeters / 1609.34).toFixed(1);
          setDistance(`${distInMiles} miles away`);
        } catch (err) {
          console.error("Failed to get distance:", err);
          setDistance("Distance unknown");
        }
      } else {
        setDistance("Login to see distance");
      }

      setLoading(false);
    };

    initialize();
  }, [minderId]);

  const handleBooking = (
    service: IService | undefined = minder?.minderRoleInfo?.services?.[0]
  ) => {
    if (!user) {
      navigate("/login");
    } else {
      if (minder) {
        navigate("/booking", { state: { minderId: minder.id, service } });
      }
    }
  };

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

  if (loading) {
    return <div style={{ margin: "auto" }}>Loading...</div>;
  }

  if (!minder) {
    return <div style={{ margin: "auto" }}>Minder not found.</div>;
  }

  return (
    <div className={styles["minderPage"] + " container"}>
      <BackButton />
      <div className={styles["minderPageContainer"]}>
        <div className={styles["mainContent"]}>
          <div className={styles["minderHeader"]}>
            <div className={styles["profileInfo"]}>
              <Link to={`/users/${minder.id}`}>
                <img
                  src={minder.primaryUserInfo.profilePic}
                  alt={`${minder.name.fname} ${minder.name.sname}`}
                  className={styles["profilePic"]}
                />
              </Link>
              <div className={styles["minderInfo"]}>
                <Link to={`/users/${minder.id}`}>
                  <h2>
                    {minder.name.fname} {minder.name.sname}
                  </h2>
                </Link>
                <div className={styles["distance-rating"]}>
                  <div className={styles["metric"] + " " + styles["distance"]}>
                    <MapPin size={18} />
                    <p>{distance}</p>
                  </div>
                  <div className={styles["metric"] + " " + styles["rating"]}>
                    <Star size={18} />
                    <span>
                      {parseFloat(minder.minderRoleInfo.rating.toFixed(1))}
                    </span>
                    <p
                      style={{
                        display: "flex",
                        alignContent: "center",
                        gap: "7px",
                        marginLeft: "2px",
                      }}
                    >
                      <strong>•</strong>
                      {minder.minderRoleInfo.reviews?.length}{" "}
                      {minder.minderRoleInfo.reviews?.length === 1
                        ? "review"
                        : "reviews"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles["actions"]}>
              {user && user.id !== minder.id && (
                <button
                  className={"btn btn-secondary" + " " + styles["iconBtn"]}
                  onClick={handleMessage}
                >
                  <MessageSquare size={18} />
                  Message
                </button>
              )}
              {user &&
                user.currentRole === Role.OWNER &&
                user.id !== minder.id && (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleBooking()}
                  >
                    Book Now
                  </button>
                )}
            </div>
          </div>

          <div className={styles["navigation"]}>
            <button
              className={selectedTab === "about" ? styles["active"] : ""}
              onClick={() => setSelectedTab("about")}
            >
              About
            </button>
            <button
              className={selectedTab === "services" ? styles["active"] : ""}
              onClick={() => setSelectedTab("services")}
            >
              Services
            </button>
            <button
              className={selectedTab === "reviews" ? styles["active"] : ""}
              onClick={() => setSelectedTab("reviews")}
            >
              Reviews
            </button>
          </div>

          {selectedTab === "about" && <About minder={minder} />}
          {selectedTab === "services" && (
            <Services minder={minder} onBooking={handleBooking} />
          )}
          {selectedTab === "reviews" && (
            <Reviews
              minder={minder}
              sortedReviews={sortedReviews}
              reviewers={reviewers}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MinderPage;
