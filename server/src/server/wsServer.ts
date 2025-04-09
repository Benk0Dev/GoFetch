import { Server, Socket } from 'socket.io';
import http from 'http';
import { addMessage, messageRead, markChatAsRead } from '@server/static/MessageStatic';
import { addNotification } from '@server/static/NotificationStatic';
import { NotificationType } from '@gofetch/models/INotification';
import { getChatByIdCached, incrementUnreadCount } from '@server/services/MessagesCached';
import { IChat } from '@gofetch/models/IMessage';

const messageLenghtLimit = 100; // Limit for message length

// Add a variable to store the IO instance
let io: Server;

// Add a function to get the IO instance
export function getIO() {
    return io;
}

// Initialize Socket.IO server
export function setupWebSocketServer(httpServer: http.Server) {
    io = new Server(httpServer, {
        cors: {
            origin: ["http://localhost:3000", "http://localhost:5173"],
            methods: ["GET", "POST", "OPTIONS"],
            credentials: true,
            allowedHeaders: ["Content-Type"]
        },
        transports: ['polling', 'websocket'],
        pingTimeout: 60000,
        pingInterval: 25000
    });

    // Socket connection handlers
    io.on('connection', (socket: Socket) => {
        console.log('New socket connection:', socket.id);

        // Handle ping (for debugging)
        socket.on('ping', () => {
            console.log(`Received ping from ${socket.id}`);
            socket.emit('pong', { time: new Date().toISOString() });
        });

        // Handle user registration
        socket.on('register-user', (userId) => {
            console.log(`User ${userId} registered on socket ${socket.id}`);
            socket.join(`user-${userId}`);
        });

        // Handle chat room
        socket.on('join-chat', (chatId) => {
            console.log(`Socket ${socket.id} joined chat-${chatId}`);
            socket.join(`chat-${chatId}`);
        });

        socket.on('send-message', (messageData) => {
            console.log(`Received message from ${messageData.message.senderId} in chat ${messageData.chatId}`);
            
            const result = addMessage(messageData.chatId, messageData.message);
            
            if (result.success) {
                const chatRoom = `chat-${messageData.chatId}`;
                
                // Get the chat details to find the other user
                const chatDetails = getChatByIdCached(messageData.chatId);
                if (chatDetails) {
                    // Notify other users in this chat
                    const otherUsers = chatDetails.users.filter(
                        (userId: number) => userId !== messageData.message.senderId
                    );
                    
                    otherUsers.forEach((recipientId: number) => {
                        const userRoom = `user-${recipientId}`;
                        
                        // Check if recipient is already actively viewing the chat
                        // by checking if any socket with their user ID is in this chat room
                        let isRecipientInChat = false;
                        const recipientSockets = io.sockets.adapter.rooms.get(userRoom);
                        
                        if (recipientSockets) {
                            // Check each socket belonging to this user
                            for (const socketId of recipientSockets) {
                                const socket = io.sockets.sockets.get(socketId);
                                if (socket && socket.rooms.has(chatRoom)) {
                                    isRecipientInChat = true;
                                    break;
                                }
                            }
                        }
                        
                        // Only send notification if recipient is not already in the chat
                        if (!isRecipientInChat) {
                            console.log(`Sending notification to user ${recipientId} - not viewing chat`);
                            
                            // Update unread count in the chat for this specific user only
                            incrementUnreadCount(messageData.chatId, recipientId);

                            const chatUpdate: IChat = {
                                id: messageData.chatId,
                                users: chatDetails.users,
                                messages: chatDetails.messages,
                                lastMessage: messageData.message.message,
                                lastMessageDate: messageData.message.timestamp,
                                unreadCount: chatDetails.unreadCount,
                                unreadCounts: chatDetails.unreadCounts,
                                isRead: chatDetails.isRead,
                                userReadStatus: chatDetails.userReadStatus
                            }

                            io.to(userRoom).emit('chat-update', chatUpdate);
                            
                            // Create a notification for the message
                            addNotification({
                                userId: recipientId,
                                message: `New message: ${messageData.message.message.substring(0, messageLenghtLimit)}${messageData.message.message.length > messageLenghtLimit ? '...' : ''}`,
                                type: NotificationType.Message,
                                linkId: messageData.chatId
                            });
                        } else {
                            console.log(`User ${recipientId} is actively viewing chat - no notification needed`);
                            
                            // Mark the message as read immediately since user is viewing the chat
                            if (result.message) {
                                messageRead(messageData.chatId, result.message.id, recipientId);
                            }
                        }
                    });
                }
            } else {
                // If there was an error, send it back to the sender
                socket.emit('message-error', { 
                    error: result.error,
                    originalMessage: messageData
                });
            }
        });

        socket.on('read-message', (messageData) => {
            messageRead(messageData.chatId, messageData.messageId, messageData.userId);
            
            // Get updated chat to send correct unread counts to all users
            const updatedChat = getChatByIdCached(messageData.chatId);
            if (updatedChat) {
                // Emit the message read event
                socket.to(`chat-${messageData.chatId}`).emit('message-read', messageData);

                // Emit updated chat with per-user unread counts
                io.to(`chat-${messageData.chatId}`).emit('chat-updated', updatedChat);
            }
        });

        socket.on('chat-read', (data) => {
            console.log(`Chat ${data.chatId} marked as read by user ${data.userId}`);
            // Update the chat read status for this specific user
            markChatAsRead(data.chatId, data.userId);
            
            // Get updated chat to send correct unread counts to all users
            const updatedChat = getChatByIdCached(data.chatId);
            if (updatedChat) {
                // Broadcast to all users in this chat the updated chat with per-user counts
                io.to(`chat-${data.chatId}`).emit('chat-updated', updatedChat);
            }
        });

        socket.on('leave-chat', (chatId) => {
            console.log(`Socket ${socket.id} left chat-${chatId}`);
            socket.leave(`chat-${chatId}`);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });
    });

    return io;
}