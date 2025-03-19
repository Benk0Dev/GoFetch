import React from "react";
import "./MinderCard.css";

interface Minder {
  id: number;
  fullName: string;
  bio: string;
  rating: number;
  location: string;
  availability: string;
  distanceRange: number;
  verified: boolean;
  pictures: string[];
}

interface MinderCardProps {
  minder: Minder;
}

const MinderCard: React.FC<MinderCardProps> = ({ minder }) => {
  return (
    <div className="minder-card">
      <h2>{minder.fullName}</h2>
      <p>{minder.bio}</p>
      <p>
        <strong>Rating:</strong> {minder.rating}
      </p>
      <p>
        <strong>Location:</strong> {minder.location}
      </p>
      <p>
        <strong>Availability:</strong> {minder.availability}
      </p>
      <p>
        <strong>Distance Range:</strong> {minder.distanceRange} miles
      </p>
      <p>
        <strong>Verified:</strong> {minder.verified ? "Yes" : "No"}
      </p>

      <div className="minder-images">
        {minder.pictures?.map((pic, index) => (
          <img
            key={index}
            src={`/images/user_images/${pic}`}
            alt={`${minder.fullName} ${index}`}
            width="150"
          />
        ))}
      </div>

      {/* 🔥 Book Button */}
      <button className="book-button">Book</button>
    </div>
  );
};

export default MinderCard;
