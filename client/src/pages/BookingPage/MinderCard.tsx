import styles from "@client/pages/BookingPage/BookingPage.module.css";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { getDistanceBetweenAddresses, loadGooglePlacesScript } from "@client/services/googleApi";
import { useAuth } from "@client/context/AuthContext";

const MinderCard = ({ minder }: { minder: any}) => {
  const { user } = useAuth();
  const [distance, setDistance] = useState<string>("Loading...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDistance = async () => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchDistance();
  }, []);

  return (
    <div className={styles.minderCard}>
      <div className={styles.profileInfo}>
        <Link to={`/users/${minder.id}`}>
          <img
            src={minder.primaryUserInfo.profilePic}
            alt={`${minder.name.fname} ${minder.name.sname}`}
            className={styles.profilePic}
          />
        </Link>
        <div className={styles.minderInfo}>
          <Link to={`/users/${minder.id}`}>
            <h2>
              {minder.name.fname} {minder.name.sname}
            </h2>
          </Link>
          <div className={styles.metric}>
            <MapPin size={18} />
            <p>{loading ? "Loading..." : distance}</p>
          </div>
          <div className={styles.metric}>
            <CalendarDays size={18} />
            <p>{minder.minderRoleInfo.availability}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinderCard;