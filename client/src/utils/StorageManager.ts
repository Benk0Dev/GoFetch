import User, { PrimaryUser, PetOwner, Role } from "../models/User";

const USER_ID = "userID";
const USER_TYPE = "userType";
const USER_DETAILS = "userDetails";

export interface IUserDetails {
    fname: string;
    lname: string;
    email: string;
    username: string;
    allRoles: Role[];
}

export function saveUser(user: User): void {
    localStorage.setItem(USER_ID, user.userDetails.id.toString());

    let userTypes: Role[] = [];
    
    if (user.isAdmin()) {
        localStorage.setItem(USER_TYPE, Role.ADMIN);
        userTypes.push(Role.ADMIN);
    } else if (user.userClass instanceof PrimaryUser) {
        if (user.userClass.role.currentRole instanceof PetOwner) {
            localStorage.setItem(USER_TYPE, Role.OWNER);
            userTypes.push(Role.OWNER);
            if (user.userClass.role.prevRole) {
                userTypes.push(Role.MINDER);
            }
        } else {
            localStorage.setItem(USER_TYPE, Role.MINDER);
            userTypes.push(Role.MINDER);
            if (user.userClass.role.prevRole) {
                userTypes.push(Role.OWNER);
            }
        }
    }

    const userDetails: IUserDetails = {
        fname: user.userDetails.fname,
        lname: user.userDetails.lname,
        email: user.userDetails.loginDetails.email,
        username: user.userDetails.loginDetails.username,
        allRoles: userTypes,
    };

    localStorage.setItem(USER_DETAILS, JSON.stringify(userDetails));
}

export function getUserID(): number | null {
    const storedUser = localStorage.getItem(USER_ID);
    return storedUser ? parseInt(storedUser, 10) : null;
}

export function getUserType(): string | null {
    return localStorage.getItem(USER_TYPE);
}

export function getDetails(): IUserDetails | null {
    const storedDetails = localStorage.getItem(USER_DETAILS);
    return storedDetails ? JSON.parse(storedDetails) : null;
}

export function clearUser(): void {
    localStorage.removeItem(USER_ID);
    localStorage.removeItem(USER_TYPE);
    localStorage.removeItem(USER_DETAILS);
}

export function changeUserType(userType: Role): void {
    if (getDetails()?.allRoles.includes(userType)) {
        localStorage.setItem(USER_TYPE, userType);
    } else {
        throw new Error("Invalid user type");
    }
}