import { getCachedUsersWithPets, RegisterUserCache } from '../services/UserCached';
import { ILoginDetails } from '../models/IUser';

export function AllUsersData() {
  return getCachedUsersWithPets();
}

export function getUserByID(id: number) {
  return getCachedUsersWithPets().find(user => user.userDetails.id === id);
}

export function RegisterUser(user: ILoginDetails) {
  return RegisterUserCache(user);
}