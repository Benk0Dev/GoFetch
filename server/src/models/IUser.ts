import { IPet } from './IPet';
import { IService } from './IService';

export interface IUser {
  userDetails: IUserDetails;
  roles: Role[];
  currentRole: Role;
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
  sname: string;
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
  suspendReason?: string | null;
  suspendEndsAt?: Date | null;
}

export interface IOwnerRoleInfo {
  petIDs: number[];
  pets?: IPet[];
}

export interface IMinderRoleInfo {
  serviceIDs: number[];
  services?: IService[];
  rating: number;
  bio: string;
  pictures: string[];
  availability: string;
  distanceRange: number;
  verified: boolean;
}

export interface ILocation {
  name: string;
  longitude: number;
  latitude: number;
}

export interface IRegisterUser {
  fname: string, 
  sname: string, 
  email: string, 
  username: string, 
  password: string, 
  dob: Date, 
  role: Role
}