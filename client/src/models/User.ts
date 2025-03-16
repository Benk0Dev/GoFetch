import { IUserDetails, IPrimaryUserInfo, Role, IMinderRoleInfoWithoutServiceIDs, ILocation } from '../../../server/src/models/IUser';
import { IPet } from './IPet';
import { IService } from './IService';
import { logout } from '../services/AuthService';

export type { IUserDetails, IPrimaryUserInfo, IMinderRoleInfoWithoutServiceIDs, ILocation } from '../../../server/src/models/IUser';
export { Role };

export default class User {
    userDetails: IUserDetails;
    userClass: Admin | PrimaryUser;

    constructor(userDetails: IUserDetails, userClass: Admin | PrimaryUser) {
        this.userDetails = userDetails;
        this.userClass = userClass;
    }

    isAdmin() {
        return this.userClass instanceof Admin;
    }
}

export class Admin {}

export class PrimaryUser implements IPrimaryUserInfo {
    role: UserRole;
    profilePic: string;
    dob: Date;
    location: ILocation;
    suspended: boolean;
    suspendReason: string | null;
    suspendEndsAt: Date | null;

    constructor(role: Role, profilePic: string, dob: Date, location: ILocation, suspended: boolean, suspendReason?: string | null, suspendEndsAt?: Date | null) {
        this.role = new UserRole(role);
        this.profilePic = profilePic;
        this.dob = dob;
        this.location = location;
        this.suspended = suspended;
        this.suspendReason = suspendReason || null;
        this.suspendEndsAt = suspendEndsAt || null;
    }

    deleteUser() {
        logout();
        // Delete user from database
    }
}

class UserRole {
    currentRole: PetOwner | PetMinder;
    prevRole: PetOwner | PetMinder | null;

    constructor(role: Role) {
        if (role === Role.OWNER) {
            this.currentRole = new PetOwner();
        } else if (role === Role.MINDER) {
            this.currentRole = new PetMinder();
        } else {
            throw new Error("Invalid role");
        }
        this.prevRole = null;
    }

    switchRole() {
        if (this.prevRole === null) {
            this.prevRole = this.currentRole;
            if (this.currentRole instanceof PetOwner) {
                this.currentRole = new PetMinder();
            }
            else {
                this.currentRole = new PetOwner();
            }
        } else {
            const temp = this.currentRole;
            this.currentRole = this.prevRole;
            this.prevRole = temp;
        }
    };
}

export class PetOwner {
    pets: IPet[];

    constructor(pets?: IPet[]) {
        this.pets = pets || [];
    }

    addPet(pet: IPet) {
        this.pets.push(pet);
    }

    removePet(pet: IPet) {
        this.pets = this.pets.filter(p => p !== pet);
    }
}

export class PetMinder implements IMinderRoleInfoWithoutServiceIDs {
    services: IService[];
    rating: number;
    bio: string;
    pictures: string[];
    availability: string;
    distanceRange: number;
    verified: boolean;

    constructor(services?: IService[], rating?: number, bio?: string, pictures?: string[], availability?: string, distanceRange?: number, verified?: boolean) {
        this.services = services || [];
        this.rating = rating || 0;
        this.bio = bio || "";
        this.pictures = pictures || [];
        this.availability = availability || "";
        this.distanceRange = distanceRange || 0;
        this.verified = verified || false;
    }

    addService(service: IService) {
        this.services.push(service);
    }

    removeService(service: IService) {
        this.services = this.services.filter(s => s !== service);
    }

    verify() {
        this.verified = true;
    }
}
