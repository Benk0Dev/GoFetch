import { IRegisterdUser, IUser } from "@gofetch/models/IUser";
import { IPet } from "@gofetch/models/IPet";
import { clearUser, setUserId } from "@client/utils/StorageManager";
import { getImageByFilename } from "@client/services/ImageRegistry";
import defaultPet from "@client/assets/images/default-pet-picture.svg";
import defaultProfile from "@client/assets/images/default-profile-picture.svg";

import { API_URL } from "@client/services/Registry";
import { INewSuspension } from "@gofetch/models/ISuspension";

export async function login(credentials: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credentials, password })
    });
    if (response.ok) {
      const user = await response.json();
      setUserId(user.id);
      return user;
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

export function logout() {
  clearUser();
}

export async function verifyUniqueEmail(email: string) {
  const allUsers = await getAllUsers();
  if (allUsers) {
    const existingEmail = allUsers.find((user: IUser) => user.loginDetails.email === email);
    return { email: existingEmail };
  }
  return null;
}

export async function registerUser(user: IRegisterdUser) {
  try {
    const response = await fetch(`${API_URL}/registerUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user)
    });
    if (response.ok) {
      const user = await response.json();
      setUserId(user.id);
      const completeUser = await getUserById(user.id);
      return completeUser;
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

export async function editUser(id: number, user: any) {
  try {
    const response = await fetch(`${API_URL}/editUser/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user)
    });
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getUserById(id: number) {
  try {
    const response = await fetch(`${API_URL}/user/${id}`);
    if (response.ok) {
      const user = await response.json();
      return user;
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

export async function getUserByIdWithPictures(id: number) {
  try {
    const response = await fetch(`${API_URL}/user/${id}`);
    if (response.ok) {
      const user = await response.json();

      // Get profile picture
      const profilePicURL = user.primaryUserInfo.profilePic ? await getImageByFilename(user.primaryUserInfo.profilePic) : defaultProfile;

      // Get minder pictures
      const minderPictures = user.minderRoleInfo.pictures;
      const minderPictureURLs = await Promise.all(
        minderPictures.map(async (filename: string) => {
          return filename ? await getImageByFilename(filename) : null;
        })
      );

      // Get pet pictures
      const pets = user.ownerRoleInfo.pets;
      const petsWithPictures = await Promise.all(
        pets.map(async (pet: IPet) => {
          const petPicURL = pet.picture ? await getImageByFilename(pet.picture) : defaultPet;
          return { ...pet, picture: petPicURL };
        })
      );

      return {
        ...user,
        primaryUserInfo: { ...user.primaryUserInfo, profilePic: profilePicURL },
        minderRoleInfo: { ...user.minderRoleInfo, pictures: minderPictureURLs },
        ownerRoleInfo: { ...user.ownerRoleInfo, pets: petsWithPictures }
      };
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

export async function getAllUsers() {
  try {
    const response = await fetch(`${API_URL}/users`);
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

export async function deleteUser(id: number) {
  try {
    const response = await fetch(`${API_URL}/user/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      return true;
    } else {
      const text = await response.text();
      console.error(text);
      return false;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function suspendUser(id: number, suspension: INewSuspension) {
  try {
    const response = await fetch(`${API_URL}/suspendUser/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(suspension)
    });
    if (response.ok) {
      return true;
    } else {
      const text = await response.text();
      console.error(text);
      return false;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function removeSuspension(id: number) {
  try {
    const response = await fetch(`${API_URL}/removeSuspension/${id}`, {
      method: "POST",
    });
    if (response.ok) {
      return true;
    } else {
      const text = await response.text();
      console.error(text);
      return false;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}