import { IBooking } from './IBooking';
import { IPet } from './IPet';
import { IReview } from './IReview';
import { IService } from './IService';

export interface IUser {
  id: number;
  name: IName;
  loginDetails: ILoginDetails;
  roles: Role[];
  currentRole: Role;
  primaryUserInfo: IPrimaryUserInfo;
  ownerRoleInfo: IOwnerRoleInfo;
  minderRoleInfo: IMinderRoleInfo;
}

export interface IName {
  fname: string;
  sname: string;
}

export interface ILoginDetails {
  email: string;
  password: string;
}

export interface IPrimaryUserInfo {
  profilePic: string;
  dob: Date;
  address: IAddress;
}

export interface IOwnerRoleInfo {
  petIds: number[];
  pets?: IPet[];
  bookingIds: number[];
  bookings?: IBooking[];
}

export interface IMinderRoleInfo {
  serviceIds: number[];
  services?: IService[];
  rating: number;
  bio: string;
  pictures: string[];
  availability: Availability;
  bookingIds: number[];
  bookings?: IBooking[];
  reviewIds: number[];
  reviews?: IReview[];
}

export interface IAddress {
  street: string;
  city: string;
  postcode: string;
  country: string;
}

export interface IRegisterdUser {
  fname: string, 
  sname: string, 
  email: string, 
  dob: Date, 
  address: IAddress,
  password: string, 
  role: Role
  profilePic?: string,
}

export enum Role {
  OWNER = 'petowner',
  MINDER = 'petminder',
  ADMIN = 'admin'
}

export enum Availability {
  FLEXIBLE = 'Flexible',
  WEEKDAYS = 'Weekdays',
  WEEKENDS = 'Weekends',
}