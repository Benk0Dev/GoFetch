import User, { Role } from "../models/User";
import { saveUser, getUserID, clearUser } from "../utils/StorageManager";
import { fetchUsers } from "./Registry";

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
