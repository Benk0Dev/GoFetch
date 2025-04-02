import { IChat } from "@gofetch/models/IMessage";
import { getUserId } from "@client/utils/StorageManager";

import { API_URL } from "@client/services/Registry";

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

export async function getSortedUserChats() {
    const result = await getUserChats();
    
    if (result.chats && result.chats.length > 0) {
        // Sort chats by lastMessageDate in descending order (newest first)
        result.chats.sort((a: IChat, b: IChat) => {
            const dateA = new Date(a.lastMessageDate).getTime();
            const dateB = new Date(b.lastMessageDate).getTime();
            return dateB - dateA;
        });
    }
    
    return result;
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
    const existingChat = userChats.find((chat: IChat) => 
        chat.users.includes(withUserId) && chat.users.includes(userId)
);
if (existingChat) {
    return existingChat;
} else {
    const newChatResponse = await createNewChat([userId, withUserId]);
    return newChatResponse;
}
}