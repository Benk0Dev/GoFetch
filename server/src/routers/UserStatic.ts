import { getCachedUsersWithPets, getCachedUserWithPets, RegisterUserCache } from '../services/UserCached';
import { getCachedPets } from '../services/PetCached';
import { getCachedServices } from '../services/ServiceCached';
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