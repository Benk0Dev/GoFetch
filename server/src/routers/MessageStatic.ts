import { IMessage, IChat } from '../models/IMessage';
import { getChatsForUserCached, getChatByIdCached, addMessageCached, createChatCached } from '../services/MessagesCached';

export function getChatsForUser(userId: number) {
    return { success: true, chats: getChatsForUserCached(userId) };
}

export function getChatById(chatId: number) {
    return { success: true, chat: getChatByIdCached(chatId) };
}

export function addMessage(chatId: number, message: Omit<IMessage, 'id'>) {
    return { success: true, message: addMessageCached(chatId, message) };
}

export function createChat(chat: Omit<IChat, 'id' | 'messages'>) {
    return { success: true, chat: createChatCached(chat) };
}