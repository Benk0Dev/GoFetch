import fs from 'fs';
import { IUser, ILoginDetails, Role } from '../models/IUser';
import { cache, DB_PATH } from './Cache';

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

    // Create new user object
    const newUser: IUser = {
      userDetails: {
        id: cache.users.length + 1,
        fname: '',
        lname: '',
        loginDetails: {
          email: user.email,
          username: user.email,
          password: user.password, // Note: In a real app, we should hash passwords(idc for now)
        },
      },
      roles: [Role.OWNER],
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
    saveUsersToFile(cache.users);

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

export function removeUserCache(id: number): { success: boolean; message: string } {
  try {
    // Find the user
    const userIndex = cache.users.findIndex(u => u.userDetails.id === id);
    if (userIndex < 0) {
      return { success: false, message: 'User not found' };
    }

    // Remove the user
    cache.users.splice(userIndex, 1);

    // Write back to the database file
    saveUsersToFile(cache.users);

    return { success: true, message: 'User removed successfully' };
  } catch (error) {
    console.error('Error removing user:', error);
    return { success: false, message: `Deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

function saveUsersToFile(users: IUser[]) {
  fs.writeFileSync(`${DB_PATH}/users.json`, JSON.stringify(users, null, 2), 'utf8');
}