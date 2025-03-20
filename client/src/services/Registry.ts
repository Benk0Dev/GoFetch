import User, { IUserDetails, Admin, PrimaryUser, Role, PetOwner, PetMinder } from "../models/User";
import { IPet } from "../models/IPet";
import { IService } from "../models/IService";
import { get } from "./FetchService";
import { getCurrentUserID } from "./AuthService";

class Registry {
  private users: User[] = [];
  private currentUser: User | null = null; // Stores logged-in user
  private pets: IPet[] = [];
  private services: IService[] = [];
  private loaded: boolean = false; // Prevent redundant fetching
    register: any;

  // Fetch all users, pets, and services once
  async initialize() {
    if (this.loaded) return; // Avoid re-fetching
    this.pets = await this.fetchPetsFromAPI();
    this.services = await this.fetchServicesFromAPI();
    this.users = await this.fetchUsersFromAPI();
    this.loaded = true;

    // Try loading the current user from local storage
    const storedUserId = Number(getCurrentUserID);
    if (storedUserId) {
      this.currentUser = this.getUserById(storedUserId);
    }
  }

  // Check if registry is loaded
  isLoaded(): boolean {
    return this.loaded;
  }

  // Fetch users from API & map them correctly
  private async fetchUsersFromAPI(): Promise<User[]> {
    const usersData = await get("/users");

    return usersData.map((user: any) => {
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

      if (user.roles.includes(Role.ADMIN)) {
        return new User(userDetails, new Admin());
      }

      if (user.roles.includes(Role.OWNER) || user.roles.includes(Role.MINDER)) {
        const primaryInfo = user.primaryUserInfo;
        const role = user.roles.includes(Role.MINDER) ? Role.MINDER : Role.OWNER;

        const primaryUser = new PrimaryUser(
          role,
          primaryInfo.profilePic,
          primaryInfo.dob,
          primaryInfo.location,
          primaryInfo.suspended
        );

        const userRole = primaryUser.role.currentRole;
        if (userRole instanceof PetOwner) { 
          userRole.pets = user.ownerRoleInfo.petIDs.map((petID: number) => this.pets.find(pet => pet.id === petID));
        } else if (userRole instanceof PetMinder) {
          userRole.services = user.minderRoleInfo.serviceIDs.map((serviceID: number) => this.services.find(service => service.id === serviceID));
          userRole.rating = user.minderRoleInfo.rating;
          userRole.bio = user.minderRoleInfo.bio;
          userRole.pictures = user.minderRoleInfo.pictures;
          userRole.availability = user.minderRoleInfo.availability;
          userRole.distanceRange = user.minderRoleInfo.distanceRange;
          userRole.verified = user.minderRoleInfo.verified;

          if (user.roles.includes(Role.OWNER)) {
            primaryUser.role.switchRole();
            if (userRole instanceof PetOwner) {
              userRole.pets = user.ownerRoleInfo.petIDs.map((petID: number) => this.pets.find(pet => pet.id === petID));
            }
            primaryUser.role.switchRole();
          }
        }

        return new User(userDetails, primaryUser);
      }

      return null;
    }).filter((user: any) => user !== null); // Remove null values
  }

  // Fetch pets from API
  private async fetchPetsFromAPI(): Promise<IPet[]> {
    const petsData = await get("/pets");
    return petsData.map((pet: any) => ({
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
    }));
  }

  // Fetch services from API
  private async fetchServicesFromAPI(): Promise<IService[]> {
    const servicesData = await get("/services");
    return servicesData.map((service: any) => ({
      id: service.id,
      type: service.type,
      duration: service.duration,
      price: service.price,
    }));
  }

  // Get all users (from memory, no API call)
  getUsers(): User[] {
    return this.users;
  }

  // Get user by ID
  getUserById(id: number): User | null {
    return this.users.find(user => user.userDetails.id === id) || null;
  }

  // Get current logged-in user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Set current user (when logging in)
  setCurrentUser(user: User) {
    this.currentUser = user;
  }

  // Clear current user (when logging out)
  clearCurrentUser() {
    this.currentUser = null;
  }

  // Get all pets
  getPets(): IPet[] {
    return this.pets;
  }

  // Get all services
  getServices(): IService[] {
    return this.services;
  }
}

// Export a single instance (Singleton)
const registry = new Registry();
export default registry;
