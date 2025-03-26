import { IRegisterUser } from "../models/IUser";
import { EBookingStatus, INewBooking } from "../models/IBooking";
import { clearUser, getUserId, setUserId } from "../utils/StorageManager";
import imageCompression from 'browser-image-compression';
import defaultProfile from "../assets/images/default-profile-picture.svg"
import defaultPet from "../assets/images/default-pet-picture.svg"

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
            const completeUser = await getUserById(user.userDetails.id);
            return completeUser;
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

export async function getUserByIdWithPictures(id: number) {
    try {
        const response = await fetch(`${API_URL}/user/${id}`);
        if (response.ok) {
            const user = await response.json();

            // Get profile picture
            const profilePicURL = user.primaryUserInfo.profilePic ? await getImageByFilename(user.primaryUserInfo.profilePic) : defaultProfile;

            // Get minder pictures
            const minderPictures = user.minderRoleInfo.pictures;
            const minderPictureURLs = await Promise.all(
                minderPictures.map(async (filename: string) => {
                    return filename ? await getImageByFilename(filename) : null;
                })
            );

            // Get pet pictures
            const pets = user.ownerRoleInfo.pets;
            const petsWithPictures = await Promise.all(
                pets.map(async (pet: any) => {
                    const petPicURL = pet.picture ? await getImageByFilename(pet.picture) : defaultPet;
                    return { ...pet, picture: petPicURL };
                })
            );            

            return { 
                ...user, 
                primaryUserInfo: { ...user.primaryUserInfo, profilePic: profilePicURL },
                minderRoleInfo: { ...user.minderRoleInfo, pictures: minderPictureURLs },
                ownerRoleInfo: { ...user.ownerRoleInfo, pets: petsWithPictures }
            };
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

export async function getAllMindersWithPictures() {
    try {
        const response = await fetch(`${API_URL}/minders`);
        if (!response.ok) {
            const text = await response.text();
            console.error(text);
            return null;
        }

        const users = await response.json();

        const usersWithPictures = await Promise.all(users.map(async (user: any) => {
            // Fetch minder role pictures
            const rawPictures = user.minderRoleInfo.pictures || [];
            const pictureURLs = await Promise.all(
                rawPictures.map(async (filename: string) =>
                    filename ? await getImageByFilename(filename) : null
                )
            );

            // Fetch profile picture if valid
            const profilePicURL = user.primaryUserInfo.profilePic
                ? await getImageByFilename(user.primaryUserInfo.profilePic)
                : rawPictures.length ? pictureURLs[0] : defaultProfile;

            return {
                ...user,
                primaryUserInfo: {
                    ...user.primaryUserInfo,
                    profilePic: profilePicURL
                },
                minderRoleInfo: {
                    ...user.minderRoleInfo,
                    pictures: pictureURLs.filter(Boolean) // Remove nulls if any
                }
            };
        }));

        return usersWithPictures;
    } catch (e) {
        console.error("Failed to fetch minders with pictures:", e);
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
    try {
        const response = await fetch(`${API_URL}/chat/${chatId}`);
        return await response.json();
    } catch (error) {
        console.error('Error getting chat:', error);
        return { success: false, error: 'Failed to get chat' };
    }
}

export async function sendMessage(chatId: number, message: { senderId: number, message: string }) {
    try {
        const response = await fetch(`${API_URL}/chat/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chatId,
                message
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Error sending message:', error);
        return { success: false, error: 'Failed to send message' };
    }
}

export async function createChat(users: number[]) {
    try {
        const response = await fetch(`${API_URL}/chat/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                users,
                lastMessage: ''
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating chat:', error);
        return { success: false, error: 'Failed to create chat' };
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

// Creates a new chat if one does not exist between the two users, otherwise returns the existing chat
export async function startChat(withUserId: number) {
    const userId = getUserId();
    if (!userId) {
        return null;
    }
    const chatsResponse = await getUserChats();
    const userChats = chatsResponse.chats;
    const existingChat = userChats.find((chat: any) => 
        chat.users.includes(withUserId) && chat.users.includes(userId)
    );
    if (existingChat) {
        return existingChat;
    } else {
        const newChatResponse = await createNewChat([userId, withUserId]);
        return newChatResponse;
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

export async function getImageByFilename(filename: string | undefined | null) {
    if (!filename || filename.startsWith("blob:")) return null;

    try {
        const response = await fetch(`${API_URL}/image/${filename}`);
        if (response.ok) {
            const data = await response.blob();
            return URL.createObjectURL(data);
        } else {
            return null;
        }
    } catch (e) {
        console.error("Failed to fetch image:", filename, e);
        return null;
    }
}

export const createBooking = async (bookingData: INewBooking) => {
    try {
        const response = await fetch(`${API_URL}/booking`, { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bookingData)
        });
        if (response.ok) {
            const booking = await response.json();

            const minder = await getUserById(booking.minderId);

            const editMinder = await editUser(booking.minderId, {
                minderRoleInfo: {
                    bookingIDs: [booking.id, ...minder.minderRoleInfo.bookings.map((b: any) => b.id)],
                }
            });

            if (!editMinder) {
                return null;
            }

            const petOwner = await getUserById(booking.ownerId);

            const editOwner = await editUser(booking.ownerId, {
                ownerRoleInfo: {
                    bookingIDs: [booking.id, ...petOwner.ownerRoleInfo.bookings.map((b: any) => b.id)],
                }
            });

            if (!editOwner) {
                return null;
            }

            return booking;
        } else {
            const text = await response.text();
            console.error(text);
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
};

export async function setBookingStatus(bookingId: number, status: EBookingStatus) {
    try {
        const response = await fetch(`${API_URL}/booking/${bookingId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status })
        });
        if (response.ok) {
            const booking = await response.json();
            return booking;
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

export async function addService(userId: number, service: any) {
    try {
        const response = await fetch(`${API_URL}/newservice/${userId}`, { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(service)
        });
        if (response.ok) {
            return true;
        } else {
            const text = await response.text();
            console.error(text);
            return false;
        }
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function editService(serviceId: number, service: any) {
    try {
        const response = await fetch(`${API_URL}/editservice/${serviceId}`, { 
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(service)
        });
        if (response.ok) {
            return true;
        } else {
            const text = await response.text();
            console.error(text);
            return false;
        }
    } catch (e) {
        console.error(e);
        return false;
    }
}
export async function deleteService(serviceId: number) {
    try {
        const response = await fetch(`${API_URL}/deleteservice/${serviceId}`, { 
            method: "DELETE"
        });
        if (response.ok) {
            return true;
        } else {
            const text = await response.text();
            console.error(text);
            return false;
        }
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function getAllServices() {
    try {
        const response = await fetch(`${API_URL}/services`);
        if (response.ok) {
            const services = await response.json();
            return services;
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

export async function getServiceById(serviceId: number) {
    try {
        const response = await fetch(`${API_URL}/service/${serviceId}`);
        if (response.ok) {
            const service = await response.json();
            return service;
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

export async function addPetForUser(userId: number, pet: any) {
    try {
        const response = await fetch(`${API_URL}/user/${userId}/pet`, { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(pet)
        });
        if (response.ok) {
            return true;
        } else {
            const text = await response.text();
            console.error(text);
            return false;
        }
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function removePetForUser(userId: number, petId: number) {
    try {
        const response = await fetch(`${API_URL}/removePet/${petId}`, { 
            method: "DELETE"
        });
        if (response.ok) {
            return true;
        } else {
            const text = await response.text();
            console.error(text);
            return false;
        }
    } catch (e) {
        console.error(e);
        return false;
    }
}