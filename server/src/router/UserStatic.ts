import { getCachedUsersWithPets, getCachedUserWithPets, RegisterUserCache } from '../utils/DbCache';
import { ILoginDetails } from '../models/IUser';

export function AllUsersData() {
  return getCachedUsersWithPets();
}

export function UserData(id: string | undefined) {
  if (!id || isNaN(Number(id))) {
      return 'User not found';
  }
  return getCachedUserWithPets(Number(id)) || 'User not found';
}

export function RegisterUser(user: ILoginDetails) {
  return RegisterUserCache(user);
}