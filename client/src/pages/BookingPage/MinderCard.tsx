import React, { useEffect, useState } from "react";
import { getUserByIdWithPictures } from "@client/services/Registry";
import { IUser } from "@gofetch/models/IUser";
import styles from "@client/pages/BookingPage/MinderCard.module.css";
import defaultUser from "@client/assets/images/default-profile-picture.svg";

interface MinderCardProps {
  minderId: number;
}

const MinderCard: React.FC<MinderCardProps> = ({ minderId }) => {
  const [minder, setMinder] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchMinder = async () => {
      try {
        const fetched = await getUserByIdWithPictures(minderId);
        if (fetched) setMinder(fetched);
      } catch (error) {
        console.error("Failed to fetch minder:", error);
      }
    };

    fetchMinder();
  }, [minderId]);

  if (!minder) return null;

  return (
    <div className={styles.card}>
      <h1 className={styles.name}>
        {minder.name.fname || "Pet Minder"}
      </h1>

      <div className="minder-image">
        <img
          src={
              minder.primaryUserInfo.profilePic === defaultUser ? minder.minderRoleInfo.pictures.length > 0 ? minder.minderRoleInfo.pictures[0] : defaultUser : minder.primaryUserInfo.profilePic
          }
          alt={minder.name.fname}
          width="400"
        />
      </div>

      <p className={styles.bio}>
        Lifelong pet lover and certified dog trainer.
      </p>

      <div className={styles.infoLine}>
        🗓️ <strong>Availability:</strong> {minder.minderRoleInfo.availability || "N/A"}
      </div>
    </div>
  );
};

export default MinderCard;