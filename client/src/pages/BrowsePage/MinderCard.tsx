import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import "@client/pages/BrowsePage/MinderCard.css";
import { useAuth } from "@client/context/AuthContext";
import { Role } from "@gofetch/models/IUser";

function MinderCard({ minder }: { minder: any }) {
  const { user } = useAuth();

  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleBooking = () => {
    if (!user) {
      navigate("/login"); // ✅ Redirect to login if not logged in
    } else {
        navigate("/booking", { state: { minderId: minder.id } }); // ✅ Redirect to booking if logged in
    }
  };

  return (
    <div className="minder-card">
      {/* ✅ Main Display Image or fallback */}
      <div className="minder-image">
        <img
          src={minder.primaryUserInfo.profilePic}
          alt={minder.name.fname}
          width="150"
        />
      </div>

      <h2>{minder.name.fname}</h2>
      <p className="bio">{minder.minderRoleInfo.bio}</p>

      <p>
        <strong>⭐ Rating:</strong> {minder.minderRoleInfo.rating} / 5
      </p>
      <p>
        <strong>
          <MapPin /> Location:
        </strong>{" "}
        {minder.primaryUserInfo.address.city}
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

      {(!user || user.currentRole === Role.OWNER) && (
        <button className="book-button" onClick={handleBooking}>
        Book
      </button>
      )}
      
    </div>
  );
}

export default MinderCard;
