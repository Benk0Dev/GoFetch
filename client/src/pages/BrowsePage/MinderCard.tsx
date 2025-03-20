import { useNavigate } from "react-router-dom";
import "./MinderCard.css";

function MinderCard({ minder }: { minder: any }) {
  const navigate = useNavigate();

  // const handleBookClick = () => {
  //   if (currentUserId) {
  //     navigate(`/booking/${currentUserId}/${minder.id}`);
  //   } else {
  //     navigate("/login");
  //   }
  // };
  return (
    <div className="minder-card">
      <h2>{minder.userDetails.fname}</h2>
      <p>{minder.minderRoleInfo.bio}</p>
      <p>
        <strong>Rating:</strong> {minder.minderRoleInfo.rating}
      </p>
      <p>
        <strong>Location:</strong> {minder.primaryUserInfo.location.name}
      </p>
      <p>
        <strong>Availability:</strong> {minder.minderRoleInfo.availability}
      </p>
      <p>
        <strong>Distance Range:</strong> {minder.minderRoleInfo.distanceRange}{" "}
        miles
      </p>
      <p>
        <strong>Verified:</strong>{" "}
        {minder.minderRoleInfo.verified ? "Yes" : "No"}
      </p>

      <div className="minder-images">
        {minder.minderRoleInfo.pictures?.map((pic: any, index: any) => (
          <img
            key={index}
            src={`/images/user_images/${pic}`}
            alt={`${minder.userDetails.bio} ${index}`}
            width="150"
          />
        ))}
      </div>

      {/* 🔥 Book Button */}
      <button className="book-button">Book</button>
    </div>
  );
}

export default MinderCard;
