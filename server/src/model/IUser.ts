import IPet from './IPet';

export enum Role {
  Petowner = 'petowner',
  Petminder = 'petminder',
  Admin = 'admin'
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role | string;
  description: string;
  pets?: IPet[];
  petIds?: number[];
  address: IAddress | null;
  createdAt: Date;
  updatedAt: Date;
  banned: boolean;
  banReason: string | null;
  banEndsAt: Date | null;
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
}