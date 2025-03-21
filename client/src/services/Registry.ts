import { IRegisterUser } from "../models/IUser";
import { clearUser, getUserId, getUserRole, setUser, setUserRole } from "../utils/StorageManager";

const API_URL = "http://localhost:3001";

export async function login(credentials: string, password: string) {
    try {
        const response = await fetch(`${API_URL}/login`, { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ credentials, password })
        });
        if (response.ok) {
            const data = await response.json();
            const user = data.user;
            setUser(user.userDetails.id, user.roles[0]);
            notifyUserUpdate();
            return user;
        } else {
            const text = await response.text();
            console.error(text);
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}

export function logout() {
    clearUser();
    notifyUserUpdate();
}

export async function verifyUniqueEmailAndUsername(email: string, username: string) {
    const allUsers = await getAllUsers();
    if (allUsers) {
        const existingEmail = allUsers.find((user: any) => user.userDetails.loginDetails.email === email);
        const existingUsername = allUsers.find((user: any) => user.userDetails.loginDetails.username === username);
        return { email: existingEmail, username: existingUsername };
    }
    return null;
}

export async function registerUser(user: IRegisterUser) {
    try {
        const response = await fetch(`${API_URL}/registerUser`, { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        });
        if (response.ok) {
            const data = await response.json();
            console.log("From Regitry, data:", data);
            const user = data.user;
            setUser(user.userDetails.id, user.roles[0]);
            notifyUserUpdate();
            console.log("From Regitry, register complete");
            return data.user;
        } else {
            const text = await response.text();
            console.error(text);
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function switchRole() {
    if (getUserId() === null) {
        return;
    }
    const user = await getUserById(Number(getUserId()));
    if (user.roles.length > 1) {
        getUserRole() === user.roles[0] ? setUserRole(user.roles[1]) : setUserRole(user.roles[0]);
        notifyUserUpdate();
        return true;
    } else {
        return false;
    }
}

export async function getUserById(id: number) {
    try {
        const response = await fetch(`${API_URL}/user/${id}`);
        if (response.ok) {
            const data = await response.json();
            return data.user;
        } else {
            const text = await response.text();
            console.error(text);
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function getUserByUsername(username: string) {
    try {
        const response = await fetch(`${API_URL}/user/username/${username}`);
        if (response.ok) {
            const data = await response.json();
            return data.user;
        } else {
            const text = await response.text();
            console.error(text);
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function getAllUsers() {
    try {
        const response = await fetch(`${API_URL}/users`);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const text = await response.text();
            console.error(text);
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function getAllMinders() {
    try {
        const response = await fetch(`${API_URL}/minders`);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const text = await response.text();
            console.error(text);
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}

function notifyUserUpdate() {
    window.dispatchEvent(new Event("userUpdate")); // Notify all listeners
}