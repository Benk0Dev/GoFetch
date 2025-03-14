import User, { IUserDetails, Admin, PrimaryUser, Role, PetOwner, PetMinder } from "../models/User";
import { IPet } from "../models/IPet";
import { IService } from "../models/IService";
import { get } from "./FetchService";

export async function fetchUsers(): Promise<User[]> {
  const users = await get("/users");

  return users.map((user: any) => {
    const userDetails: IUserDetails = {
      id: user.userDetails.id,
      fname: user.userDetails.fname,
      lname: user.userDetails.lname,
      loginDetails: {
        email: user.userDetails.loginDetails.email,
        username: user.userDetails.loginDetails.username,
        password: user.userDetails.loginDetails.password
      }
    };

    // If the user is an admin
    if (user.roles.includes(Role.ADMIN)) {
      return new User(userDetails, new Admin());
    }
    // For owner, minder, or both, we assume the user has primary user info.
    if (user.roles.includes(Role.OWNER) || user.roles.includes(Role.MINDER)) {
      const primaryInfo = user.primaryUserInfo;
      // Instantiate a PrimaryUser with the role based on a simple rule:
      // if the user has both roles, default to MINDER.
      const role = user.roles.includes(Role.MINDER) ? Role.MINDER : Role.OWNER;

      // Create a PrimaryUser using the provided primary info.
      const primaryUser = new PrimaryUser(
        role,
        primaryInfo.profilePic,
        primaryInfo.dob,
        primaryInfo.location,
        primaryInfo.suspended
      );

      const userRole = primaryUser.role;
      if (userRole instanceof PetOwner) {
        // Make fetched pets rather than indexes.
        userRole.pets = primaryInfo.petIDs;
      } else if (userRole instanceof PetMinder) {
        // Make fetched services rather than indexes.
        userRole.services = primaryInfo.serviceIDs;
        userRole.rating = primaryInfo.rating;
        userRole.bio = primaryInfo.bio;
        userRole.pictures = primaryInfo.pictures;
        userRole.availability = primaryInfo.availability;
        userRole.distanceRange = primaryInfo.distanceRange;
        userRole.verified = primaryInfo.verified;

        if (user.roles.includes(Role.OWNER)) {
            userRole.switchRole();
            if (userRole instanceof PetOwner) {
                // Make fetched pets rather than indexes.
                userRole.pets = primaryInfo.petIDs;  
            }
            userRole.switchRole();
        }
      }

      return new User(userDetails, primaryUser);
    }
    return null;
  });
}

export async function fetchUser(id: number): Promise<User | null> {
    const users = await fetchUsers();
    return users.find((user) => user.userDetails.id === id) || null;
}

export async function fetchPets(): Promise<IPet[]> {
  const pets = await get("/pets");

  return pets.map((pet: any) => {
    const petObj: IPet = {
      id: pet.id,
      name: pet.name,
      dob: pet.dob,
      gender: pet.gender,
      breed: pet.breed,
      weight: pet.weight,
      neutered: pet.neutered,
      behaviour: pet.behaviour,
      allergies: pet.allergies,
      pictures: pet.pictures,
    }
    return petObj;
  });
}

export async function fetchServices(): Promise<IService[]> {
    const services = await get("/services");
  
    return services.map((service: any) => {
      const serviceObj: IService = {
        id: service.id,
        type: service.type,
        duration: service.duration,
        price: service.price,
      }
      return serviceObj;
    });
  }