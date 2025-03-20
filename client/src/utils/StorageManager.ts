import { Role } from "../models/IUser";

const USER_ID = "userID";
const USER_ROLE = "userRole";

export function setUser(id: number, role: Role): void {
    localStorage.setItem(USER_ID, id.toString());
    localStorage.setItem(USER_ROLE, role);
}

export function getUserId(): number | null {
    const storedUser = localStorage.getItem(USER_ID);
    return storedUser ? parseInt(storedUser, 10) : null;
}

export function setUserId(id: number): void {
    localStorage.setItem(USER_ID, id.toString());
}

export function getUserRole(): Role | null {
    return localStorage.getItem(USER_ROLE) as Role;
}

export function setUserRole(role: Role): void {
    localStorage.setItem(USER_ROLE, role);
}

export function clearUser(): void {
    localStorage.removeItem(USER_ID);
    localStorage.removeItem(USER_ROLE);
}
