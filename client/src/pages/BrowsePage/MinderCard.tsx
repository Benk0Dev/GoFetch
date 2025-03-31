import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import styles from "@client/pages/BrowsePage/BrowsePage.module.css";
import { useAuth } from "@client/context/AuthContext";
import { Role, IUser } from "@gofetch/models/IUser";
import {
  getDistanceBetweenAddresses,
  loadGooglePlacesScript,
} from "@client/services/googleApi";

function MinderCard({ minder }: { minder: IUser }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [distance, setDistance] = useState<string>("");

  useEffect(() => {
    const fetchDistance = async () => {
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
          console.error("Failed to fetch distance:", err);
          setDistance("Distance unknown");
        }
      }
    };

    fetchDistance();
  }, [user, minder]);

  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/minders/${minder.id}`);
  };

  const handleBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
    } else {
      navigate("/booking", { state: { minderId: minder.id } });
    }
  };

  const profileImage =
    minder.primaryUserInfo.profilePic &&
    minder.primaryUserInfo.profilePic !== ""
      ? minder.primaryUserInfo.profilePic
      : "/images/user_images/default-profile.png";

  const cheapestPrice = Math.min(
    ...(minder.minderRoleInfo.services ?? []).map(
      (service: any) => service.price
    )
  );

  const services = (minder.minderRoleInfo.services ?? []).map(
    (service: any) => service.type
  );

  return (
    <div className={styles["minder-card"]} onClick={handleViewProfile}>
      <img src={profileImage} alt={minder.name.fname} width="150" />

      <div className={styles["minder-card-body"]}>
        <h4>{minder.name.fname}</h4>

        <div className={styles["distance-rating"]}>
          <div className={styles["metric"] + " " + styles["distance"]}>
            <MapPin size={18} />
            <p>{distance || "Loading..."}</p>
          </div>
        
          <div className={styles["metric"] + " " + styles["rating"]}>
            <Star size={18} />
            <span>{parseFloat(minder.minderRoleInfo.rating.toFixed(1))}</span>
            <p style={{display: "flex", alignContent: "center", gap: "7px", marginLeft: "2px"}}><strong>•</strong>{minder.minderRoleInfo.reviews?.length} {minder.minderRoleInfo.reviews?.length === 1 ? "review" : "reviews"}</p>
          </div>
        </div>
      
        <div className={styles["services-container"]}>
          <span>Services:</span>
          <div className={styles["services"]}>
            {services.map((service: any, index: number) => (
              <span key={index} className={styles["service"]}>
                {service}
              </span>
            ))}
          </div>
        </div>
      
        <div className={styles["price-availability"]}>
          <div className={styles["metric"]}>
            <span>Price:</span>
            <p>From £{cheapestPrice}</p>
          </div>
          <div className={styles["metric"]}>
            <span>Availbility:</span>
            <p>{minder.minderRoleInfo.availability}</p>
          </div>
        </div>

        <div className={styles["buttons"]}>
          {(!user || user.currentRole === Role.OWNER) ? (
            <>
              <button className="btn btn-secondary" onClick={handleViewProfile}>View Profile</button>
              <button className="btn btn-primary" onClick={handleBook}>Book Now</button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={handleViewProfile}>View Profile</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MinderCard;
