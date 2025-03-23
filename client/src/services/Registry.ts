import { IRegisterUser } from "../models/IUser";
import { IBooking } from "../models/IBooking";
import { clearUser, getUserId, setUserId } from "../utils/StorageManager";
import imageCompression from 'browser-image-compression';

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
            const user = await response.json();
            setUserId(user.userDetails.id);
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
            const user = await response.json();
            setUserId(user.userDetails.id);
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

export async function editUser(id: number, user: any) {
    try {
        const response = await fetch(`${API_URL}/editUser/${id}`, { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        });
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function getUserById(id: number) {
    try {
        const response = await fetch(`${API_URL}/user/${id}`);
        if (response.ok) {
            const user = await response.json();
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

export async function getUserByUsername(username: string) {
    try {
        const response = await fetch(`${API_URL}/user/username/${username}`);
        if (response.ok) {
            const user = await response.json();
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

export async function getAllUsers() {
    try {
        const response = await fetch(`${API_URL}/users`);
        if (response.ok) {
            const users = await response.json();
            return users;
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
            const users = await response.json();
            return users;
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
        if (response.ok) {
            const data = await response.json();
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

export async function getUserNotifications() {
    try {
        const userId = getUserId();
        if (!userId) {
            return { notifications: [] };
        }

        const response = await fetch(`${API_URL}/notifications/${userId}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const text = await response.text();
            console.error(text);
            return { notifications: [] };
        }
    } catch (e) {
        console.error(e);
        return { notifications: [] };
    }
}

export async function markNotificationAsRead(notificationId: number) {
    try {
        const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
            method: "PUT"
        });
        if (response.ok) {
            const data = await response.json();
            return data.notification;
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

export async function uploadImage(file: File) {
    try {
        const compressedFile = await imageCompression(file, {
            maxSizeMB: 0.95,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            initialQuality: 0.9,
            fileType: file.type
        });

        const formData = new FormData();
        formData.append("image", compressedFile);

        const response = await fetch(`${API_URL}/upload-image`, {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            return data.filename;
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

export async function getImageByFilename(filename: string) {
    try {
        const response = await fetch(`${API_URL}/image/${filename}`);
        if (response.ok) {
            const data = await response.blob();
            return URL.createObjectURL(data);
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


