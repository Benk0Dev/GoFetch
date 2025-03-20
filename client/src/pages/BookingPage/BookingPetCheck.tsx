import React from "react";
import { IUserDetails } from "../../utils/StorageManager";
import { Role } from "../../models/IUser";

interface User {
  userDetails: IUserDetails;
  roles: string[];
  ownerRoleInfo?: {
    petIDs: number[];
  };
}

interface Props {
  user: User;
}

const UserProfile: React.FC<Props> = ({ user }) => {
  const hasPets = user.ownerRoleInfo && user.ownerRoleInfo.petIDs.length > 0;

  const handleCreatePetProfile = () => {
    // Logic to create a pet profile
    console.log("Create pet profile button clicked");
  };

  const displayBookingPage = () => {
    // Logic to display the booking page
    console.log("Display booking page");
  };

  return (
    <div className="user-profile">
      {hasPets ? (
        displayBookingPage()
      ) : (
        <div>
          <p>You have no pet profiles.</p>
          <button onClick={handleCreatePetProfile}>Create Pet Profile</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;