import { IMessage, IChat } from '@gofetch/models/IMessage';
import { cache, DB_PATH } from '@server/utils/Cache';
import fs from 'fs';
import path from 'path';

// Initialize cache for messages if not present
if (!cache.chats) {
    try {
        const messagesData = fs.readFileSync(path.join(DB_PATH, 'messages.json'), 'utf8');
        const parsed = JSON.parse(messagesData);
        cache.chats = parsed.chats || [];
        cache.messages = parsed.messages || [];
    } catch (error) {
        console.error('Error loading messages data:', error);
        cache.chats = [];
        cache.messages = [];

        // Create initial messages.json file if it doesn't exist
        saveMessagesToFile();
    }
}

export function getChatsForUserCached(userId: number): IChat[] {
    return cache.chats.filter(chat => chat.users.includes(userId));
}

export function getChatByIdCached(chatId: number): IChat | null {
    const chat = cache.chats.find(c => c.id === chatId);
    if (chat) {
        // Get all messages for this chat
        const chatMessages = cache.messages.filter(m => m.chatId === chatId);
        return {
            ...chat,
            messages: chatMessages
        };
    }
    return null;
}

export function addMessageCached(chatID: number, messageData: Omit<IMessage, 'id'>): IMessage {
    // Find the chat
    const chat = cache.chats.find(c => c.id === chatID);
    if (!chat) {
        throw new Error(`Chat with ID ${chatID} not found`);
    }

    // Create new message with ID
    const newId = cache.messages.length > 0 ? Math.max(...cache.messages.map(m => m.id)) + 1 : 1;

    const newMessage: IMessage = {
        id: newId,
        ...messageData,
        chatId: chatID,
        timestamp: new Date(),
        isRead: false
    };

    // Add to messages array
    cache.messages.push(newMessage);

    // Update last message in chat
    chat.lastMessage = newMessage.message;
    
    // Update last message date in chat
    chat.lastMessageDate = newMessage.timestamp;

    // Save to file
    saveMessagesToFile();

    return newMessage;
}

export function createChatCached(chatData: Omit<IChat, 'id' | 'messages'>): IChat {
    // Create new chat with ID
    const newId = cache.chats.length > 0 ? Math.max(...cache.chats.map(c => c.id)) + 1 : 1;

    const newChat: IChat = {
        id: newId,
        users: chatData.users,
        lastMessage: chatData.lastMessage || '',
        lastMessageDate: chatData.lastMessageDate || new Date(),
        messages: [],
        unreadCount: 0,
        isRead: false
    };

    // Add to chats array
    cache.chats.push(newChat);

    // Save to file
    saveMessagesToFile();

    return newChat;
}

export function chatWith2UsersCached(userId1: number, userId2: number): { chatId: number } | null {
    const chat = cache.chats.find(c => c.users.includes(userId1) && c.users.includes(userId2));
    if (chat) {
        return {
            chatId: chat.id,
        };
    }
    return null;
}

export function messageReadCached(chatId: number, messageId: number, userId: number): void {
    const chat = cache.chats.find(c => c.id === chatId);
    if (!chat) {
        throw new Error(`Chat with ID ${chatId} not found`);
    }

    const message = cache.messages.find(m => m.id === messageId && m.chatId === chatId);
    if (!message) {
        throw new Error(`Message with ID ${messageId} not found in chat ${chatId}`);
    }

    // Mark the message as read
    message.isRead = true;

    // Save to file
    saveMessagesToFile();
}

function saveMessagesToFile() {
    try {
        fs.writeFileSync(
            path.join(DB_PATH, 'messages.json'),
            JSON.stringify({
                chats: cache.chats.map(c => ({ ...c, messages: undefined })),
                messages: cache.messages
            }, null, 2),
            'utf8'
        );
    } catch (error) {
        console.error('Error saving messages data:', error);
    }
}