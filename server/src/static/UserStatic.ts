import { getCachedUsersWithAllInfo, getUserWithoutPassword, RegisterUserCache, removeUserCache, editUserCache } from '@server/services/UserCached';
import { IRegisterdUser, Role } from '@gofetch/models/IUser';
import { INewSuspension } from '@gofetch/models/ISuspension';
import { addSuspension } from './SuspensionStatic';

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
  let user = getCachedUsersWithAllInfo().find(user => (user.loginDetails.email === credentials) && user.loginDetails.password === password);
  if (user) {
    if (user.primaryUserInfo.suspension) {
      if (user.primaryUserInfo.suspension.endDate && user.primaryUserInfo.suspension.endDate <= new Date()) {
        // Remove suspension if it has expired
        editUser(user.id, { suspensionId: 0 });
        user = { ...user, primaryUserInfo: { ...user.primaryUserInfo, suspension: null } };
      }
    }
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

export function suspendUser(id: number, suspension: INewSuspension) {
  const newSuspension = addSuspension(suspension);
  if (newSuspension.success) {
    const editedUser = editUser(id, { primaryUserInfo: { suspensionId: newSuspension.suspension.id } });
    if (editedUser.success) {
      return { success: true, message: 'User suspended successfully' };
    } else {
      return { success: false, message: 'Suspension not added' };
    }
  } else {
    return { success: false, message: 'Suspension not added' };
  }
}