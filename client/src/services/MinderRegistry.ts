import { IUser } from "@gofetch/models/IUser";
import defaultProfile from "@client/assets/images/default-profile-picture.svg";
import { getImageByFilename } from "@client/services/ImageRegistry";

import { API_URL } from "@client/services/Registry";

export async function getAllMinders() {
  try {
    const response = await fetch(`${API_URL}/minders`);
    if (response.ok) {
      const users = await response.json();
      return users;
    } else {
      const text = await response.text();
      console.error(text);
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getAllMindersWithPictures() {
  try {
    const response = await fetch(`${API_URL}/minders`);
    if (!response.ok) {
      const text = await response.text();
      console.error(text);
      return null;
    }

    const users = await response.json();

    const usersWithPictures = await Promise.all(users.map(async (user: IUser) => {
      // Fetch minder role pictures
      const rawPictures = user.minderRoleInfo.pictures || [];
      const pictureURLs = await Promise.all(
        rawPictures.map(async (filename: string) =>
          filename ? await getImageByFilename(filename) : null
        )
      );

      // Fetch profile picture if valid
      const profilePicURL = user.primaryUserInfo.profilePic
        ? await getImageByFilename(user.primaryUserInfo.profilePic)
        : rawPictures.length ? pictureURLs[0] : defaultProfile;

      return {
        ...user,
        primaryUserInfo: {
          ...user.primaryUserInfo,
          profilePic: profilePicURL
        },
        minderRoleInfo: {
          ...user.minderRoleInfo,
          pictures: pictureURLs.filter(Boolean) // Remove nulls if any
        }
      };
    }));

    return usersWithPictures;
  } catch (e) {
    console.error("Failed to fetch minders with pictures:", e);
    return null;
  }
}