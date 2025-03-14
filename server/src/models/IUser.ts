import { IPet } from './IPet';

export interface IUser {
  userDetails: IUserDetails;
  roles: Role[];
  primaryUserInfo?: IPrimaryUserInfo;
  ownerRoleInfo?: IOwnerRoleInfo;
  minderRoleInfo?: IMinderRoleInfo;
}

export interface ILoginDetails {
  email: string;
  username: string;
  password: string;
}

export interface IUserDetails {
  id: number;
  fname: string;
  lname: string;
  loginDetails: ILoginDetails;
}

export enum Role {
  OWNER = 'petowner',
  MINDER = 'petminder',
  ADMIN = 'admin'
}

export interface IPrimaryUserInfo {
  profilePic: string;
  dob: Date;
  location: ILocation;
  suspended: boolean;
  suspendReason: string | null;
  suspendEndsAt: Date | null;
}

export interface IOwnerRoleInfo {
  petIDs: number[];
  pets?: IPet[];
}

export interface IMinderRoleInfoWithoutServiceIDs {
  rating: number;
  bio: string;
  pictures: string[];
  availability: string;
  distanceRange: number;
  verified: boolean;
}

export interface IMinderRoleInfo extends IMinderRoleInfoWithoutServiceIDs {
  serviceIDs: number[];
}

export interface ILocation {
  name: string;
  longitude: number;
  latitude: number;
}
