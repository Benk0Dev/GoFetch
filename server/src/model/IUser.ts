import IPet from './IPet';

export default interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    description: string;
    petIds: number[];
    pets: IPet[];
    address: IAddress;
    createdAt: Date;
    updatedAt: Date;
    banned: boolean;
    banReason: string;
    banEndsAt: Date;
}

export interface IAddress {
    street: string;
    city: string;
    state: string;
    zip: string;
}