import User, { PrimaryUser, Role } from "../models/User";
import { IUserDetails, saveUser, getUserID, clearUser, changeUserType, getUserType, getDetails } from "../utils/StorageManager";
import registry from "./Registry";

function notifyUserUpdate() {
    window.dispatchEvent(new Event("userUpdate")); // Notify all listeners
}

export async function login(email: string, password: string): Promise<User | null> {
    try {
        // Get users directly from the registry (no API call)
        const users = registry.getUsers();

        const foundUser = users.find((user) =>
            user.userDetails.loginDetails.email === email &&
            user.userDetails.loginDetails.password === password
        );

        if (!foundUser) return null;

        // Store logged-in user in Registry & Local Storage
        registry.setCurrentUser(foundUser);
        saveUser(foundUser);
        notifyUserUpdate(); // Trigger global update event

        return foundUser;
    } catch (error) {
        console.error("Login error:", error);
        return null;
    }
}

// Assign the current logged-in user to the registry (used on page load)
export function assignCurrentUser(): void {
    const users = registry.getUsers();
    const currentUser = users.find((user) => user.userDetails.id === getCurrentUserID());
    if (currentUser) {
        registry.setCurrentUser(currentUser);
    }
}

// Returns the current logged-in user's ID (from storage)
export function getCurrentUserID(): number | null {
    return getUserID();
}

// Get user role (Admin, PetOwner, or PetMinder)
export function getCurrentUserType(): Role | null {
    return getUserType() as Role;
}

// Get all user roles (Admin, PetOwner, and PetMinder)
export function getAllCurrentUserDetails(): IUserDetails | null {
    return getDetails();
}

// Get the current logged-in user
export function getCurrentUser(): User | null {
    return registry.getCurrentUser();
}

// Logout function - clears stored user session
export function logout(): void {
    registry.clearCurrentUser();
    clearUser();
    notifyUserUpdate(); // Trigger global update event
}

// Switch the current user's role
export function switchUserRole(): void {
    const user = registry.getCurrentUser();
    if (!user || !(user.userClass instanceof PrimaryUser)) return;
    user.userClass.role.switchRole();
    changeUserType(getCurrentUserType() === Role.OWNER ? Role.MINDER : Role.OWNER);
    notifyUserUpdate(); // Trigger global update event
}
