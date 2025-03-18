import { getCachedUsersWithPets, RegisterUserCache, removeUserCache } from '../services/UserCached';
import { ILoginDetails } from '../models/IUser';

export function AllUsersData() {
  return getCachedUsersWithPets();
}

export function getUserByID(id: number) {
  const user = getCachedUsersWithPets().find(user => user.userDetails.id === id);
  if (user) {
    return { success: true, user};
  }
  return {success: false, message: 'User not found'};
}

export function RegisterUser(user: ILoginDetails) {
  return RegisterUserCache(user);
}

export function removeUser(id: number) {
  return removeUserCache(id);
}

export function loginUser(credentials: string, password: string) {
  const user = getCachedUsersWithPets().find(user => (user.userDetails.loginDetails.email === credentials || user.userDetails.loginDetails.username === credentials) && user.userDetails.loginDetails.password === password);
  if (user) {
    return { success: true, user};
  }
  return {success: false, message: 'Email/Username or Password is incorrect'};
}