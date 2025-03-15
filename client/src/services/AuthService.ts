import User, { Role, PrimaryUser, PetOwner } from "../models/User";
import { saveUser, getUserID, clearUser, changeUserType } from "../utils/StorageManager";
import { fetchUsers, fetchUser } from "./Registry";

export async function login(email: string, password: string): Promise<User | null> {
    try {
        const users = await fetchUsers();

        const foundUser = users.find((user) =>
            user.userDetails.loginDetails.email === email &&
            user.userDetails.loginDetails.password === password
        );

        if (!foundUser) return null;

        saveUser(foundUser);

        return foundUser;
    } catch (error) {
        console.error("Login error:", error);
        return null;
    }
}

// Returns the current logged-in user's ID
export function getCurrentUserID(): number | null {
    return getUserID();
}

// Get the current logged-in user
export async function getCurrentUser(): Promise<User | null> {
    const userID = getUserID();
    if (!userID) return null;

    const user = await fetchUser(userID);
    return user;
}

// Logout function - clears stored user session
export function logout(): void {
    clearUser();
}

// Checks if a user is logged in
export function isAuthenticated(): boolean {
    return getUserID() !== null;
}

// Get user role (Admin, PetOwner, or PetMinder)
export function getUserRole(): Role | null {
    return sessionStorage.getItem("userType") as Role;
}

export async function switchCurrentUserRole(): Promise<void> {
    const userID = getCurrentUserID();
    if (!userID) return;
    const user = await fetchUser(userID);
    if (user?.userClass instanceof PrimaryUser) {
        user?.userClass.role.switchRole();
    }
    getUserRole() === Role.OWNER ? changeUserType(Role.MINDER) : changeUserType(Role.OWNER);
}

export function switchUserRole(user: User): void {
    if (user.userClass instanceof PrimaryUser) {
        changeUserType(user.userClass.role.currentRole instanceof PetOwner ? Role.MINDER : Role.OWNER);
        user.userClass.role.switchRole();
    }
}
