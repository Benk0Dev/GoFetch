import { getCachedUsersWithAllInfo, getUserWithoutPassword, RegisterUserCache, removeUserCache, editUserCache } from '../services/UserCached';
import { IRegisterdUser, IUser, Role } from '../models/IUser';

export function AllUsersData() {
  const result = getCachedUsersWithAllInfo();
  if (result.length === 0) {
    return { success: false, message: 'No users found' };
  }
  return { success: true, users: result };
}

export function getUserByID(id: number) {
  const user = getCachedUsersWithAllInfo().find(user => user.id === id);
  if (user) {
    return { success: true, user: getUserWithoutPassword(user) };
  }
  return { success: false, message: 'User not found' };
}

export function loginUser(credentials: string, password: string) {
  const user = getCachedUsersWithAllInfo().find(user => (user.loginDetails.email === credentials) && user.loginDetails.password === password);
  if (user) {
    return { success: true, user: getUserWithoutPassword(user) };
  }
  return {success: false, message: 'Email/Username or Password is incorrect'};
}

export function RegisterUser(user: IRegisterdUser) {
  return RegisterUserCache(user);
}

export function removeUser(id: number) {
  return removeUserCache(id);
}

export function getMinders() {
  return { success: true, users: getCachedUsersWithAllInfo().filter(user => user.roles.includes(Role.MINDER))};
}

export function isUserMinder(id: number) {
  const user = getCachedUsersWithAllInfo().find(user => user.id === id);
  if (user) {
    return { success: true, isMinder: user.roles.includes(Role.MINDER) };
  }
  return { success: false, message: 'User not found' };
}

export function getUserImages(id: number) {
  const user = getCachedUsersWithAllInfo().find(user => user.id === id);
  if (user) {
    return { success: true, images: user.minderRoleInfo?.pictures };
  }
  return { success: false, message: 'User not found' };
}

export function editUser(id: number, user: any) {
  return editUserCache(id, user);
}