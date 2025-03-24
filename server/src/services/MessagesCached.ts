import { IMessage, IChat } from '../models/IMessage';
import { cache, DB_PATH } from './Cache';
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
        timestamp: new Date()
    };

    // Add to messages array
    cache.messages.push(newMessage);

    // Update last message in chat
    chat.lastMessage = newMessage.message;

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
        messages: []
    };

    // Add to chats array
    cache.chats.push(newChat);

    // Save to file
    saveMessagesToFile();

    return newChat;
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