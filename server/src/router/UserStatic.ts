import { getCachedUsersWithPets, getCachedUserWithPets, RegisterUserCache } from '../utils/DbCache';
import { IRegisterUser } from '../model/IUser';

export function AllUsersData() {
  return getCachedUsersWithPets();
}

export function UserData(id: string | undefined) {
  if (!id || isNaN(Number(id))) {
      return 'User not found';
  }
  return getCachedUserWithPets(Number(id)) || 'User not found';
}

export function RegisterUser(user: IRegisterUser) {
  return RegisterUserCache(user);
}