import React from 'react';
import { useEffect, useState } from "react";
import styles from './MessagingPage.module.css';
import { io, Socket } from 'socket.io-client';

function MessagingPage() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<{msg: string}[]>([]);

    useEffect(() => {
        // Connect to the WebSocket server
        const newSocket = io('http://localhost:3001'); // Adjust URL if server runs on a different port
        setSocket(newSocket);

        // Set up event listeners
        newSocket.on('chat message', (msg: {msg: string}) => {
            setMessages(prevMessages => [...prevMessages, msg]);
        });

        // Error handling
        newSocket.on('connect_error', (err) => {
            console.error('Connection error:', err);
        });

        // Cleanup on component unmount
        return () => {
            newSocket.disconnect();
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && socket) {
            socket.emit('chat message', { msg: message });
            setMessage('');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.messageContainer}>
                {messages.map((msg, index) => (
                    <div key={index} className={styles.message}>
                        {msg.msg}
                    </div>
                ))}
            </div>
            
            <form className={styles.messageForm} onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={styles.messageInput}
                    placeholder="Type a message..."
                />
                <button type="submit" className={styles.sendButton}>
                    Send
                </button>
            </form>
        </div>
    );
}

export default MessagingPage;