import { useNavigate } from "react-router-dom";
import "./MinderCard.css";
import getFullFilePath from "../../utils/FullFilePath"; // ✅ Import the helper
import { MapPin } from "lucide-react";
import { getUserId } from "../../utils/StorageManager"; // ✅ Import getUserId

function MinderCard({ minder }: { minder: any }) {
  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleBooking = () => {
    const userId = getUserId();
    if (!userId) {
      navigate("/login"); // ✅ Redirect to login if not logged in
    } else {
        navigate("/booking", { state: { minderId: minder.userDetails.id } }); // ✅ Redirect to booking if logged in
    }
  };

  return (
    <div className="minder-card">
      {/* ✅ Main Display Image or fallback */}
      <div className="minder-image">
        <img
          src={
            minder.minderRoleInfo.pictures?.length > 0
              ? getFullFilePath(
                  `user_images/${minder.minderRoleInfo.pictures[0]}`
                ) // ✅ First image
              : getFullFilePath("user_images/default-profile.png") // ✅ Fallback image
          }
          alt={minder.userDetails.fname}
          width="150"
        />
      </div>

      <h2>{minder.userDetails.fname}</h2>
      <p className="bio">{minder.minderRoleInfo.bio}</p>

      <p>
        <strong>⭐ Rating:</strong> {minder.minderRoleInfo.rating} / 5
      </p>
      <p>
        <strong>
          <MapPin /> Location:
        </strong>{" "}
        {minder.primaryUserInfo.location.name}
      </p>
      <p>
        <strong>🗓️ Availability:</strong> {minder.minderRoleInfo.availability}
      </p>
      <p>
        <strong>📏 Range:</strong> {minder.minderRoleInfo.distanceRange} miles
      </p>
      <p>
        <strong>✅ Verified:</strong>{" "}
        {minder.minderRoleInfo.verified ? "Yes" : "No"}
      </p>

      {/* ✅ Additional images */}
      {minder.minderRoleInfo.pictures?.length > 1 && (
        <div className="minder-images">
          {minder.minderRoleInfo.pictures
            .slice(1)
            .map((pic: any, index: any) => (
              <img
                key={index}
                src={getFullFilePath(`user_images/${pic}`)}
                alt={`${minder.userDetails.fname} ${index + 1}`}
                width="100"
              />
            ))}
        </div>
      )}

      {/* ✅ Book Button with onClick event */}
      <button className="book-button" onClick={handleBooking}>
        Book
      </button>
    </div>
  );
}

export default MinderCard;
