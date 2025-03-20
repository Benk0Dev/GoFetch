import { getCachedUsersWithPetsAndServices, RegisterUserCache, removeUserCache } from '../services/UserCached';
import { IRegisterUser, Role } from '../models/IUser';
import { getUserWithoutPassword } from '../services/UserWithoutPassword';

export function AllUsersData() {
  return getCachedUsersWithPetsAndServices();
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