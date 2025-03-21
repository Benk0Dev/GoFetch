import { getCachedUsersWithPetsAndServices, getUserWithoutPassword, RegisterUserCache, removeUserCache, editUserCache } from '../services/UserCached';
import { IRegisterUser, IUser, Role } from '../models/IUser';

export function AllUsersData() {
  const result = getCachedUsersWithPetsAndServices();
  if (result.length === 0) {
    return { success: false, message: 'No users found' };
  }
  return { success: true, users: result };
}

export function getUserByID(id: number) {
  const user = getCachedUsersWithPetsAndServices().find(user => user.userDetails.id === id);
  if (user) {
    return { success: true, user: getUserWithoutPassword(user) };
  }
  return { success: false, message: 'User not found' };
}

export function getUserByUsername(username: string) {
  const user = getCachedUsersWithPetsAndServices().find(user =>
    user.userDetails.loginDetails.username === username
  );

  if (user) {
    return { success: true, user: getUserWithoutPassword(user) };
  }
  return { success: false, message: 'User not found' };
}

export function loginUser(credentials: string, password: string) {
  const user = getCachedUsersWithPetsAndServices().find(user => (user.userDetails.loginDetails.email === credentials || user.userDetails.loginDetails.username === credentials) && user.userDetails.loginDetails.password === password);
  if (user) {
    return { success: true, user: getUserWithoutPassword(user) };
  }
  return {success: false, message: 'Email/Username or Password is incorrect'};
}

export function RegisterUser(user: IRegisterUser) {
  return RegisterUserCache(user);
}

export function removeUser(id: number) {
  return removeUserCache(id);
}

export function getMinders() {
  return { success: true, message: getCachedUsersWithPetsAndServices().filter(user => user.roles.includes(Role.MINDER))};
}

export function isUserMinder(id: number) {
  const user = getCachedUsersWithPetsAndServices().find(user => user.userDetails.id === id);
  if (user) {
    return { success: true, isMinder: user.roles.includes(Role.MINDER) };
  }
  return { success: false, message: 'User not found' };
}

export function getUserImages(id: number) {
  const user = getCachedUsersWithPetsAndServices().find(user => user.userDetails.id === id);
  if (user) {
    return { success: true, images: user.minderRoleInfo?.pictures };
  }
  return { success: false, message: 'User not found' };
}

export function editUser(id: number, user: any) {
  return editUserCache(id, user);
}