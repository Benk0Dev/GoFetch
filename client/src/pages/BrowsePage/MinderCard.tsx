import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Star } from "lucide-react";
import "@client/pages/BrowsePage/MinderCard.css";
import { useAuth } from "@client/context/AuthContext";
import { Role } from "@gofetch/models/IUser";

function MinderCard({ minder }: { minder: any }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/minders/${minder.id}`);
  };

  const handleBookButtonClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/booking", { state: { minderId: minder.id } }); // ✅ Redirect to booking if logged in
    }
  };

  const profileImage =
    minder.primaryUserInfo.profilePic &&
    minder.primaryUserInfo.profilePic !== ""
      ? minder.primaryUserInfo.profilePic
      : "/images/user_images/default-profile.png";

  return (
    <div>
      <div className="minder-card" onClick={handleCardClick}>
        <div className="minder-image">
          <img src={profileImage} alt={minder.name.fname} width="150" />
        </div>

        <h2>{minder.name.fname}</h2>
        <p className="bio">{minder.minderRoleInfo.bio}</p>

        <div className="minder-info">
          <p>
            <Star /> {parseFloat(minder.minderRoleInfo.rating.toFixed(1))} / 5
          </p>
          <p>
            <MapPin /> {minder.primaryUserInfo.address.city}
          </p>
          <p>
            <Calendar /> {minder.minderRoleInfo.availability}
          </p>
        </div>
      </div>

      {(!user || user.currentRole === Role.OWNER) && (
        <button className="book-button" onClick={handleBookButtonClick}>
          Book
        </button>
      )}
    </div>
  );
}

export default MinderCard;
