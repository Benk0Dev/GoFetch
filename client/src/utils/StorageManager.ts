const USER_ID = "userId";

export function setUserId(id: number): void {
    localStorage.setItem(USER_ID, id.toString());
}

export function getUserId(): number | null {
    const storedUser = localStorage.getItem(USER_ID);
    return storedUser ? parseInt(storedUser, 10) : null;
}

export function clearUser(): void {
    localStorage.removeItem(USER_ID);
}
