import fs from 'fs';
import { IUser, ILoginDetails, Role } from '../models/IUser';
import { cache, DB_PATH } from './DbCache';

// Get cached users
export function getCachedUsers(): IUser[] {
  return cache.users;
}

// Get all users with their pets populated
export function getCachedUsersWithPets(): IUser[] {
  return cache.users.map(user => {
    const userWithPets = { ...user };   // Clone the user to avoid modifying the cache directly
    const petIds = user.ownerRoleInfo?.petIDs || [];    // Get the pet IDs (handle the structure mismatch in your data)
    const userPets = cache.pets.filter(pet => petIds.includes(pet.id)); // Populate pets
    if (userWithPets.ownerRoleInfo) {
      userWithPets.ownerRoleInfo.pets = userPets;
    }

    return userWithPets;
  });
}

export function RegisterUserCache(user: ILoginDetails): { success: boolean; message: string; user?: IUser } {
  if (!user) {
    return { success: false, message: 'User data is required' };
  }

  try {
    // Validate required fields
    if (!user.email || !user.password) {
      return { success: false, message: 'Email, and password are required' };
    }
    // Check if email already exists
    const existingUser = cache.users.find(u => u.userDetails.loginDetails.email === user.email);
    if (existingUser) {
      return { success: false, message: 'Email already registered' };
    }

    // Generate a new ID
    const newId = Math.max(...cache.users.map(u => u.userDetails.id), 0) + 1;

    // Create new user object
    const newUser: IUser = {
      userDetails: {
        id: newId,
        fname: '',
        lname: '',
        loginDetails: {
          email: user.email,
          username: user.email,
          password: user.password, // Note: In a real app, we should hash passwords(idc for now)
        },
      },
      roles: ['petowner' as Role],
      primaryUserInfo: {
        profilePic: '',
        dob: new Date(),
        location: { name: '', longitude: 0, latitude: 0 },
        suspended: false,
        suspendReason: null,
        suspendEndsAt: null,
      },
      ownerRoleInfo: {
        petIDs: [],
      },
      minderRoleInfo: {
        rating: 0,
        bio: '',
        pictures: [],
        availability: '',
        distanceRange: 0,
        verified: false,
        serviceIDs: [],
      }
    };

    // Add to cache
    cache.users.push(newUser);

    // Write back to the database file
    fs.writeFileSync(`${DB_PATH}/users.json`, JSON.stringify(cache.users, null, 2), 'utf8');

    // Return success without password
    const { userDetails: { loginDetails: { password, ...loginDetails }, ...userDetails }, ...userWithoutPassword } = newUser;
    return {
      success: true,
      message: 'User registered successfully',
      user: userWithoutPassword as IUser
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, message: `Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}