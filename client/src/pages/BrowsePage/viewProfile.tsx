import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../models/IUser";
import { getUserByIdWithPictures } from "../../services/Registry";
import styles from "./viewProfile.module.css";
import { MapPin, Calendar, Star, Check, Ruler } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ViewProfile = () => {
  const { minderId } = useParams();
  const [minder, setMinder] = useState<IUser | null>(null);
  const [selectedTab, setSelectedTab] = useState("about"); // New: tab state
  const navigate = useNavigate();

  const { user } = useAuth(); // 👈 get user from AuthContext

  const handleBooking = (event: React.MouseEvent) => {
    if (!user) {
      navigate("/login");
    } else {
      if (minder) {
        navigate("/booking", { state: { minderId: minder.userDetails.id } });
      }
    }
  };

  useEffect(() => {
    const fetchMinderData = async () => {
      if (minderId) {
        const id = parseInt(minderId);
        if (!isNaN(id)) {
          const userData = await getUserByIdWithPictures(id);
          setMinder(userData);
        }
      }
    };

    fetchMinderData();
  }, [minderId]);

  if (!minder) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles["minder-profile"]}>
      <button
        className={styles["back-button"]}
        onClick={() => navigate("/browse")} // <-- or your actual route
      >
        ← Back to results
      </button>

      <div className={styles["minder-header"]}>
        <div className={styles["profile-info"]}>
          <img
            src={
              minder.primaryUserInfo.profilePic ||
              "/path/to/default/profile.jpg"
            }
            alt={`${minder.userDetails.fname} ${minder.userDetails.sname}`}
            className={styles["profile-pic"]}
          />
          <div className={styles["minder-info"]}>
            <h1>
              {minder.userDetails.fname} {minder.userDetails.sname}
            </h1>
            <p className={styles["location"]}>
              <MapPin />
              {minder.primaryUserInfo.location.name} -{" "}
              {minder.minderRoleInfo.distanceRange} miles away
            </p>
            <p className={styles["rating"]}>
              <Star /> {minder.minderRoleInfo.rating} / 5
            </p>
          </div>
        </div>
        <div className={styles["actions"]}>
          <button className={styles["btn"] + " " + styles["message-btn"]}>
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
      </div>

      {selectedTab === "about" && (
        <div className={styles["tab-content"]}>
          <h2>
            About {minder.userDetails.fname} {minder.userDetails.sname}
          </h2>
          <p className={styles["bio"]}>{minder.minderRoleInfo.bio}</p>
        </div>
      )}
    </div>
  );
};

export default ViewProfile;
