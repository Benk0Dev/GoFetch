import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server } from 'http';

export function startWsServer(server: Server) {
    const port = process.env.PORT || 3001;
    const io = new SocketIOServer(server, {
        // Add CORS configuration to allow client connections
        cors: {
            origin: "http://localhost:5173", // Your React app's URL
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    interface ChatMessage {
        msg: string;
    }

    io.on('connection', (socket: Socket) => {
        console.log('a user connected', socket.id);

        // Send welcome message to the newly connected client
        socket.emit('chat message', { msg: 'Welcome to GoFetch Messaging!' });

        socket.on('disconnect', () => {
            console.log('user disconnected', socket.id);
        });

        socket.on('chat message', (msg: ChatMessage) => {
            console.log('message received:', msg);
            io.emit('chat message', msg);
        });

        // Handle errors
        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    });

    // Log when the WebSocket server starts
    console.log(`WebSocket server is running on ws://localhost:${port}`);
}