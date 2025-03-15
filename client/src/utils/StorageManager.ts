import User, { PrimaryUser, PetOwner, Role } from "../models/User";

export function saveUser(user: User): void {
    localStorage.setItem("userID", user.userDetails.id.toString());
    
    if (user.isAdmin()) {
        localStorage.setItem("userType", Role.ADMIN);
    } else if (user.userClass instanceof PrimaryUser) {
        if (user.userClass.role.currentRole instanceof PetOwner) {
            localStorage.setItem("userType", Role.OWNER);
        } else {
            localStorage.setItem("userType", Role.MINDER);
        }
    }
}

export function getUserID(): number | null {
    const storedUser = localStorage.getItem("userID");
    return storedUser ? parseInt(storedUser, 10) : null;
}

export function getUserType(): string | null {
    return localStorage.getItem("userType");
}

export function clearUser(): void {
    localStorage.removeItem("userID");
    localStorage.removeItem("userType");
}

export function changeUserType(userType: string): void {
    localStorage.setItem("userType", userType);
}