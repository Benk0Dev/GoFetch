import fs from 'fs';
import { IUser, IRegisterUser } from '../models/IUser';
import { cache, DB_PATH } from './Cache';

// Get cached users
export function getCachedUsers(): IUser[] {
  try {
    return cache.users;
  }
  catch (error) {
    return [];
  }
}

export function getCachedUsersWithPetsServicesAndBookings(): IUser[] {
  return cache.users.map(user => {
    const userCopy = { ...user };

    if (userCopy.ownerRoleInfo) {
      userCopy.ownerRoleInfo = {
        ...userCopy.ownerRoleInfo,
        pets: cache.pets.filter(pet => user.ownerRoleInfo?.petIDs?.includes(pet.id) || false),
        bookings: cache.bookings.filter(booking => user.ownerRoleInfo?.bookingIDs?.includes(booking.ownerId) || false),
      };
      delete (userCopy.ownerRoleInfo as any).petIDs;
      delete (userCopy.ownerRoleInfo as any).bookingIDs;
    }

    if (userCopy.minderRoleInfo) {
      userCopy.minderRoleInfo = {
        ...userCopy.minderRoleInfo,
        bookings: cache.bookings.filter(booking => user.minderRoleInfo?.bookingIDs?.includes(booking.minderId) || false),
      };
      delete (userCopy.minderRoleInfo as any).serviceIDs;
      delete (userCopy.minderRoleInfo as any).bookingIDs;
    }

    return userCopy;
  });
}



export function RegisterUserCache(user: IRegisterUser) {
  if (!user.fname || !user.sname || !user.email || !user.password || !user.username || !user.dob) {
    return { success: false, message: 'All fields are required' };
  } 

  try {
    // Validate required fields
    if (!user.email || !user.password) {
      return { success: false, message: 'Email and password are required' };
    }
    // Check if email already exists
    const existingUser = cache.users.find(u => u.userDetails.loginDetails.email === user.email);
    if (existingUser) {
      return { success: false, message: 'Email already registered' };
    }

    // Validate age
    const dob = new Date(user.dob);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();

    // Adjust age if birthday hasn't occurred yet this year
    if (today.getMonth() < dob.getMonth() || 
      (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 16) {
      return { success: false, message: 'Must be at least 16 years old' };
    }

    const newId = cache.users.length > 0 ? cache.users[cache.users.length - 1].userDetails.id + 1 : 1;
    // Create new user object
    const newUser: IUser = {
      userDetails: {
        id: newId,
        fname: user.fname,
        sname: user.sname,
        loginDetails: {
          email: user.email,
          username: user.username,
          password: user.password, // Note: In a real app, we should hash passwords(idc for now)
        },
      },
      roles: [user.role],
      currentRole: user.role,
      primaryUserInfo: {
        profilePic: '',
        dob: user.dob,
        location: { name: '', longitude: 0, latitude: 0 },
        suspended: false,
        suspendReason: null,
        suspendEndsAt: null,
      },
      ownerRoleInfo: {
        petIDs: [],
        bookingIDs: [],
      },
      minderRoleInfo: {
        rating: 0,
        bio: '',
        pictures: [],
        availability: '',
        distanceRange: 0,
        verified: false,
        serviceIDs: [],
        bookingIDs: [],
      }
    };

    // Add to cache
    cache.users.push(newUser);

    // Write back to the database file
    saveUsersToFile(cache.users);
    const userWithoutPassword = getUserWithoutPassword(newUser)
    if (!userWithoutPassword) {
      return { success: false, message: 'User not found' };
    }
    return {
      success: true,
      message: 'User registered successfully',
      user: userWithoutPassword
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

export function getUserWithoutPassword(user: IUser) {
  if (user) {
    // Remove password from response
    const { userDetails: { loginDetails: { password, ...loginDetailsWithoutPassword }, ...otherUserDetails }, ...restUser } = user;
    const sanitizedUser = {
      ...restUser,
      userDetails: {
        ...otherUserDetails,
        loginDetails: loginDetailsWithoutPassword
      }
    };
    return sanitizedUser;
  }
  return null;
}

export function editUserCache(id: number, userEdits: IUser) {
  try {
    // Find the user
    const user = cache.users.find(user => user.userDetails.id === id);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Update the user
    const updatedUser = deepMerge(user, userEdits);

    if (updatedUser.userDetails) {
      updatedUser.userDetails.id = id;
    }

    // Update user
    cache.users = cache.users.map(u => u.userDetails.id === id ? updatedUser : u);

    // Write back to the database file
    saveUsersToFile(cache.users);

    return { success: true, message: 'User updated successfully' };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, message: `Update failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

function deepMerge(target: any, source: any): any {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
}

function isObject(item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export function saveUsersToFile(users: IUser[]) {
  fs.writeFileSync(`${DB_PATH}/users.json`, JSON.stringify(users, null, 2), 'utf8');
}