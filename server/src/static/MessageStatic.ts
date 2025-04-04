import { IMessage, IChat } from '@gofetch/models/IMessage';
import { addMessageCached, getChatByIdCached, getChatsForUserCached, createChatCached, messageReadCached, markChatAsReadCached } from '@server/services/MessagesCached';
import { io } from '@server/server/httpServer';

// Function to get chats for a user
export function getChatsForUser(userId: number) {
    try {
        const chats = getChatsForUserCached(userId);
        return {
            success: true,
            chats: chats
        };
    } catch (error) {
        console.error('Error getting chats for user:', error);
        return {
            success: false,
            error: 'Failed to get chats'
        };
    }
}

// Function to get a specific chat by ID
export function getChatById(chatId: number) {
    try {
        const chat = getChatByIdCached(chatId);
        if (!chat) {
            return {
                success: false,
                error: 'Chat not found'
            };
        }
        return {
            success: true,
            chat: chat
        };
    } catch (error) {
        console.error('Error getting chat by ID:', error);
        return {
            success: false,
            error: 'Failed to get chat'
        };
    }
}

// Function to add a message to a chat
export function addMessage(chatId: number, messageData: Omit<IMessage, 'id'>) {
    try {
        console.log('Adding message to chat:', chatId, messageData);
        
        // Add the message to the database
        const message = addMessageCached(chatId, messageData);
        
        // Emit the message via socket.io
        io.to(`chat-${chatId}`).emit('new-message', message);
        
        return {
            success: true,
            message: message
        };
    } catch (error) {
        console.error('Error adding message:', error);
        return {
            success: false,
            error: 'Failed to add message'
        };
    }
}

// Function to create a new chat
export function createChat(chatData: Omit<IChat, 'id' | 'messages'>) {
    try {
        const chat = createChatCached(chatData);
        return {
            success: true,
            chat: chat
        };
    } catch (error) {
        console.error('Error creating chat:', error);
        return {
            success: false,
            error: 'Failed to create chat'
        };
    }
}

export function messageRead(chatId: number, messageId: number, userId: number){
    try {
        // Mark the message as read in the database
        const result = messageReadCached(chatId, messageId, userId);
        return {
            success: true,
            result: result
        };
    } catch (error) {
        console.error('Error marking message as read:', error);
        return {
            success: false,
            error: 'Failed to mark message as read'
        };
    }
}

// Function to mark a chat as read
export function markChatAsRead(chatId: number, userId: number) {
    try {
        // Mark the chat as read in the database
        markChatAsReadCached(chatId, userId);
        return {
            success: true
        };
    } catch (error) {
        console.error('Error marking chat as read:', error);
        return {
            success: false,
            error: 'Failed to mark chat as read'
        };
    }
}