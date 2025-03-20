import React from "react";
import { IUserDetails } from "../../utils/StorageManager";
import styles from "./BookingPage.module.css";

interface PetMinder {
  userDetails: IUserDetails;
  primaryUserInfo: {
    profilePic: string;
    verified: boolean;
  };
  minderRoleInfo: {
    price: string;
    rating: number;
    availability: string;
    bio: string;
  };
}

interface MinderCardProps {
  petMinderId: number;
  minder: PetMinder;
}



const PetMinderSummary: React.FC<MinderCardProps> = ({ minder }) => {

  const petMinder: PetMinder = {
    userDetails: minder.userDetails,
    primaryUserInfo: minder.primaryUserInfo,
    minderRoleInfo: minder.minderRoleInfo,
  };

  return (
    <div className={styles.petMinderSummary}>
      <div className={styles.profileImage}>
        <img src={petMinder.primaryUserInfo.profilePic} alt={petMinder.userDetails.fname} />
        {petMinder.primaryUserInfo.verified && <span className={styles.verifiedTag}>Verified</span>}
      </div>
      <h2>{`${petMinder.userDetails.fname} ${petMinder.userDetails.lname}`}</h2>
      <p className={styles.price}>{petMinder.minderRoleInfo.price}</p>
      <p className={styles.rating}>Rating: {petMinder.minderRoleInfo.rating}</p>
      <p className={styles.availability}>Availability: {petMinder.minderRoleInfo.availability}</p>
      <p className={styles.bio}>{petMinder.minderRoleInfo.bio}</p>
    </div>
  );
};

export default PetMinderSummary;