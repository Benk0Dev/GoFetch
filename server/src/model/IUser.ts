import IPet from './IPet';

export default interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    description: string;
    pets: IPet[];
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    createdAt: Date;
    updatedAt: Date;
    banned: boolean;
    banReason: string;
    banEndsAt: Date;
}