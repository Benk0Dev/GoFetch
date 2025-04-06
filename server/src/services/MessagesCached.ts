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
        
        // Add unreadCounts and userReadStatus to existing chats if they don't exist
        cache.chats.forEach(chat => {
            if (!chat.unreadCounts) {
                chat.unreadCounts = {};
                chat.users.forEach(userId => {
                    chat.unreadCounts = chat.unreadCounts || {};
                    chat.unreadCounts[userId] = chat.unreadCount || 0;
                });
            }
            if (!chat.userReadStatus) {
                chat.userReadStatus = {};
                chat.users.forEach(userId => {
                    chat.userReadStatus = chat.userReadStatus || {};
                    chat.userReadStatus[userId] = chat.isRead || false;
                });
            }
        });
    } catch (error) {
        console.error('Error loading messages data:', error);
        cache.chats = [];
        cache.messages = [];

        // Create initial messages.json file if it doesn't exist
        saveMessagesToFile();
    }
}

export function getChatsForUserCached(userId: number): IChat[] {
    return cache.chats.filter(chat => chat.users.includes(userId)).map(chat => {
        // Return a copy of chat with unread count specific to this user
        return {
            ...chat,
            unreadCount: chat.unreadCounts?.[userId] || 0,
            isRead: chat.userReadStatus?.[userId] || false
        };
    });
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
        isRead: false,
        unreadCounts: {},
        userReadStatus: {}
    };

    // Initialize unread counts and read status for all users
    chatData.users.forEach(userId => {
        newChat.unreadCounts![userId] = 0;
        newChat.userReadStatus![userId] = true;
    });

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

    // If this is the user that didn't send the message, reduce their unread count
    if (message.senderId !== userId && chat.unreadCounts) {
        chat.unreadCounts[userId] = Math.max(0, (chat.unreadCounts[userId] || 0) - 1);
    }

    // Update legacy property for backward compatibility
    chat.unreadCount = Object.values(chat.unreadCounts || {}).reduce((acc, count) => acc + count, 0);

    // Save to file
    saveMessagesToFile();
}

export function markChatAsReadCached(chatId: number, userId: number): void {
    const chat = cache.chats.find(c => c.id === chatId);
    if (!chat) {
        throw new Error(`Chat with ID ${chatId} not found`);
    }

    // Mark all messages as read for this user
    cache.messages.forEach(message => {
        if (message.chatId === chatId && message.senderId !== userId && !message.isRead) {
            message.isRead = true;
        }
    });

    // Update chat read status for this specific user
    if (chat.userReadStatus) {
        chat.userReadStatus[userId] = true;
    }
    
    // Reset unread count for this specific user
    if (chat.unreadCounts) {
        chat.unreadCounts[userId] = 0;
    }

    // Update legacy properties for backward compatibility
    chat.isRead = Object.values(chat.userReadStatus || {}).every(status => status);
    chat.unreadCount = Object.values(chat.unreadCounts || {}).reduce((acc, count) => acc + count, 0);

    // Save to file
    saveMessagesToFile();
}

export function incrementUnreadCount(chatId: number, userId: number): void {
    const chat = cache.chats.find(c => c.id === chatId);
    if (!chat) {
        throw new Error(`Chat with ID ${chatId} not found`);
    }

    // Initialize the unreadCounts object if it doesn't exist
    if (!chat.unreadCounts) {
        chat.unreadCounts = {};
        chat.users.forEach(id => {
            chat.unreadCounts![id] = 0;
        });
    }

    // Initialize the userReadStatus object if it doesn't exist
    if (!chat.userReadStatus) {
        chat.userReadStatus = {};
        chat.users.forEach(id => {
            chat.userReadStatus![id] = true;
        });
    }

    // Increment unread count for this specific user
    chat.unreadCounts[userId] = (chat.unreadCounts[userId] || 0) + 1;
    
    // Mark the chat as unread for this specific user
    chat.userReadStatus[userId] = false;

    // Update legacy properties for backward compatibility
    chat.unreadCount = Object.values(chat.unreadCounts).reduce((acc, count) => acc + count, 0);
    chat.isRead = false;

    // Save changes to file
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