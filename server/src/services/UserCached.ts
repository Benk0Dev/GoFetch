import fs from 'fs';
import { IUser, IRegisterdUser, Availability } from '@gofetch/models/IUser';
import { cache, DB_PATH } from '@server/utils/Cache';
import { savePetsToFile } from '@server/services/PetCached';
import { saveServicesToFile } from './ServiceCached';
import { saveReviewsToFile } from './ReviewCached';
import { saveBookingsToFile } from './BookingCached';
import path from 'path';

const pathToSrc = path.join(__dirname, '../');


// Get cached users
export function getCachedUsers(): IUser[] {
  try {
    return cache.users;
  }
  catch (error) {
    return [];
  }
}

export function getCachedUsersWithAllInfo(): IUser[] {
  return cache.users.map(user => {
    const userCopy = { ...user };
    // Add pets and bookings to owner
    if (userCopy.ownerRoleInfo) {
      userCopy.ownerRoleInfo = {
        ...userCopy.ownerRoleInfo,
        pets: cache.pets.filter(pet => user.ownerRoleInfo.petIds.includes(pet.id) || false),
        bookings: cache.bookings.filter(booking => user.ownerRoleInfo.bookingIds.includes(booking.id) || false),
      };
      delete (userCopy.ownerRoleInfo as any).petIds;
      delete (userCopy.ownerRoleInfo as any).bookingIds;
    }

    // Add services, bookings and reviews to minder
    if (userCopy.minderRoleInfo) {
      userCopy.minderRoleInfo = {
        ...userCopy.minderRoleInfo,
        services: cache.services.filter(service => user.minderRoleInfo.serviceIds.includes(service.id) || false),
        bookings: cache.bookings.filter(booking => user.minderRoleInfo.bookingIds.includes(booking.id) || false),
        reviews: cache.reviews.filter(review => user.minderRoleInfo.reviewIds.includes(review.id) || false),
      };
      delete (userCopy.minderRoleInfo as any).serviceIds;
      delete (userCopy.minderRoleInfo as any).bookingIds;
      delete (userCopy.minderRoleInfo as any).reviewIds;
    }

    // Add suspension
    if (userCopy.primaryUserInfo) {
      userCopy.primaryUserInfo = {
        ...userCopy.primaryUserInfo,
        suspension: cache.suspensions.find(suspension => suspension.id === userCopy.primaryUserInfo.suspensionId) || null,
      };
      delete (userCopy.primaryUserInfo as any).suspensionId;
    }

    return userCopy;
  });
}

export function RegisterUserCache(user: IRegisterdUser) {
  console.log('Registering user:', user);
  if (!user.fname || !user.sname || !user.email || !user.password || !user.dob) {
    return { success: false, message: 'All fields are required' };
  } 

  try {
    // Validate required fields
    if (!user.email || !user.password) {
      return { success: false, message: 'Email and password are required' };
    }
    // Check if email already exists
    const existingUser = cache.users.find(u => u.loginDetails.email === user.email);
    if (existingUser) {
      return { success: false, message: 'Email already registered' };
    }

    // Validate age
    const dob = new Date(user.dob);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();

    
    // Adjust age if birthday hasn't occurred yet this year
    if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {age--}
    
    if (age < 0 || age > 120 || isNaN(age)) {
      return { success: false, message: 'Invalid date of birth' };
    }

    if (age < 16) {
      return { success: false, message: 'Must be at least 16 years old' };
    }
    
    const newId = cache.users.length > 0 ? cache.users[cache.users.length - 1].id + 1 : 1;
    // Create new user object
    const newUser: IUser = {
      id: newId,
      name: {
        fname: user.fname,
        sname: user.sname,
      },
      loginDetails: {
        email: user.email,
        password: user.password, // Note: In a real app, we should hash passwords
      },
      roles: [user.role],
      currentRole: user.role,
      primaryUserInfo: {
        profilePic: user.profilePic || '',
        dob: user.dob,
        address: user.address,
        suspensionId: 0,
      },
      ownerRoleInfo: {
        petIds: [],
        bookingIds: [],
      },
      minderRoleInfo: {
        serviceIds: [],
        rating: 0,
        bio: '',
        pictures: [],
        availability: Availability.FLEXIBLE,
        bookingIds: [],
        reviewIds: [],
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
    const userIndex = cache.users.findIndex(u => u.id === id);
    if (userIndex < 0) {
      return { success: false, message: 'User not found' };
    }

    const user = cache.users[userIndex];
    
    // Remove all attached pets
    if (user.ownerRoleInfo) {
      user.ownerRoleInfo.petIds.forEach(petId => {
        const petIndex = cache.pets.findIndex(pet => pet.id === petId);
        if (petIndex >= 0) {
          cache.pets.splice(petIndex, 1);
        }
      });
      savePetsToFile(cache.pets);
    }

    // Remove all attached services
    if (user.minderRoleInfo) {
      user.minderRoleInfo.serviceIds.forEach(serviceId => {
        const serviceIndex = cache.services.findIndex(service => service.id === serviceId);
        if (serviceIndex >= 0) {
          cache.services.splice(serviceIndex, 1);
        }
      });
      saveServicesToFile(cache.services);
    }

    // Remove all attached reviews
    if (user.minderRoleInfo) {
      user.minderRoleInfo.reviewIds.forEach(reviewId => {
        const reviewIndex = cache.reviews.findIndex(review => review.id === reviewId);
        if (reviewIndex >= 0) {
          cache.reviews.splice(reviewIndex, 1);
        }
      });
      saveReviewsToFile(cache.reviews);

    }

    // Remove all attached bookings
    if (user.ownerRoleInfo) {
      user.ownerRoleInfo.bookingIds.forEach(bookingId => {
        const bookingIndex = cache.bookings.findIndex(booking => booking.id === bookingId);
        if (bookingIndex >= 0) {
          cache.bookings.splice(bookingIndex, 1);
        }
      });
      saveBookingsToFile();
    }

    // Remove all attached notifications
    if (user.minderRoleInfo) {
      user.minderRoleInfo.bookingIds.forEach(bookingId => {
        const bookingIndex = cache.bookings.findIndex(booking => booking.id === bookingId);
        if (bookingIndex >= 0) {
          cache.bookings.splice(bookingIndex, 1);
        }
      });
      saveBookingsToFile();
    }

    // Remove all attached images
    if (user.primaryUserInfo) {
      const profilePicPath = user.primaryUserInfo.profilePic;
      if (profilePicPath) {
        const profilePicFullPath = `${pathToSrc}\\images\\${profilePicPath}`;
        if (fs.existsSync(profilePicFullPath)) {
          fs.unlinkSync(profilePicFullPath);
        } else {
          console.log(`Profile image not found: ${profilePicFullPath}`);
        }
      }
    }

    // Remove all attached images from minderRoleInfo
    if (user.minderRoleInfo) {
      user.minderRoleInfo.pictures.forEach(picture => {
        if (picture) {
          const pictureFullPath = `${pathToSrc}\\images\\${picture}`;
          if (fs.existsSync(pictureFullPath)) {
            fs.unlinkSync(pictureFullPath);
          } else {
            console.log(`Minder image not found: ${pictureFullPath}`);
          }
        }
      });
    }

    // Remove all attached images from pets
    if (user.ownerRoleInfo) {
      user.ownerRoleInfo.petIds.forEach(petId => {
        const pet = cache.pets.find(p => p.id === petId);
        if (pet && pet.picture) {
          const petPictureFullPath = `${pathToSrc}\\images\\${pet.picture}`;
          if (fs.existsSync(petPictureFullPath)) {
            fs.unlinkSync(petPictureFullPath)
          } else {
            console.log(`Pet image not found: ${petPictureFullPath}`);
          }
        }
      });
      savePetsToFile(cache.pets);
    }

    // Remove all attached reports
    if (user.minderRoleInfo) {
      user.minderRoleInfo.bookingIds.forEach(bookingId => {
        const bookingIndex = cache.bookings.findIndex(booking => booking.id === bookingId);
        if (bookingIndex >= 0) {
          cache.bookings.splice(bookingIndex, 1);
        }
      });
      saveBookingsToFile();
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
    const { loginDetails: { password, ...loginDetailsWithoutPassword }, ...restUser } = user;
    const sanitizedUser = {
      ...restUser,
      loginDetails: loginDetailsWithoutPassword,
    };
    return sanitizedUser;
  }
  return null;
}

export function editUserCache(id: number, userEdits: IUser) {
  try {
    // Find the user
    const user = cache.users.find(user => user.id === id);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Update the user
    const updatedUser = deepMerge(user, userEdits);

    if (updatedUser) {
      updatedUser.id = id;
    }

    // Update user
    cache.users = cache.users.map(u => u.id === id ? updatedUser : u);

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