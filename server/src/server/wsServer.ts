import { Server, Socket } from 'socket.io';
import http from 'http';
import { addMessage } from '@server/routers/MessageStatic';
import { addNotification } from '@server/routers/NotificationStatic';
import { NotificationType } from '@gofetch/models/INotification';

// Initialize Socket.IO server
export function setupWebSocketServer(httpServer: http.Server) {
    const io = new Server(httpServer, {
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
            
            // Use the same addMessage function that the REST API uses
            // This will save the message to the database AND emit the socket event
            const result = addMessage(messageData.chatId, messageData.message);
            
            if (result.success) {
                // Create a notification for each user in the chat except the sender
                const chat = io.sockets.adapter.rooms.get(`chat-${messageData.chatId}`);
                if (chat) {
                    // Get the chat details to find the other user
                    const chatDetails = require('../services/MessagesCached').getChatByIdCached(messageData.chatId);
                    if (chatDetails) {
                        // Notify other users in this chat
                        const otherUsers = chatDetails.users.filter(
                            (userId: number) => userId !== messageData.message.senderId
                        );
                        
                        otherUsers.forEach((recipientId: number) => {
                            // Create a notification for the message
                            addNotification({
                                userId: recipientId,
                                message: `New message: ${messageData.message.message.substring(0, 30)}${messageData.message.message.length > 30 ? '...' : ''}`,
                                type: NotificationType.Message,
                                linkId: messageData.chatId
                            });
                        });
                    }
                }
            } else {
                // If there was an error, send it back to the sender
                socket.emit('message-error', { 
                    error: result.error,
                    originalMessage: messageData
                });
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