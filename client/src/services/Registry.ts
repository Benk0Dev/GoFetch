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
            setUser(data.userDetails.id, data.roles[0]);
            notifyUserUpdate();
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
            setUser(data.userDetails.id, data.roles[0]);
            notifyUserUpdate();
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

export async function getUserByUsername(username: string) {
    try {
        const response = await fetch(`${API_URL}/user/username/${username}`);
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

export async function getUserChats() {
    try {
        const userId = getUserId();
        if (!userId) {
            return { chats: [] };
        }

        const response = await fetch(`${API_URL}/chats/${userId}`);
        console.log(response);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            return data;
        } else {
            const text = await response.text();
            console.error(text);
            return { chats: [] };
        }
    } catch (e) {
        console.error(e);
        return { chats: [] };
    }
}

export async function getChatById(chatId: number) {
    const response = await fetch(`${API_URL}/chat/${chatId}`);
    if (response.ok) {
        const data = await response.json();
        return data.chat;
    } else {
        const text = await response.text();
        console.error(text);
        return null;
    }
}

export async function sendMessage(chatId: number, message: string) {
    try {
        const response = await fetch(`${API_URL}/chat/message`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chatId,
                message: {
                    userId: Number(getUserId()),
                    message
                }
            })
        });
        if (response.ok) {
            const data = await response.json();
            return data.message;
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

export async function createNewChat(users: number[], initialMessage: string = "") {
    try {
        const response = await fetch(`${API_URL}/chat/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                users,
                lastMessage: initialMessage
            })
        });
        if (response.ok) {
            const data = await response.json();
            return data.chat;
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