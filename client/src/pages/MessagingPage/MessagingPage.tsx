import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getChatById, sendMessage, getUserById } from '../../services/Registry';
import { IChat, IMessage } from '../../models/IMessage';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import styles from './MessagingPage.module.css';

function ChatPage() {
    const { id } = useParams<{ id: string }>();
    const [chat, setChat] = useState<IChat | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();
    const { socket } = useSocket();
    const [chatName, setChatName] = useState('Chat');
    
    // Format timestamp to readable format
    const formatTime = (timestamp: Date | string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    
    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    // Fetch chat data
    const fetchChat = async () => {
        if (!id) return;
        
        try {
            setLoading(true);
            setError(null);
            const response = await getChatById(parseInt(id));
            
            if (response.success && response.chat) {
                setChat(response.chat);
            } else {
                setError('Failed to load chat');
            }
        } catch (err) {
            console.error('Error fetching chat:', err);
            setError('Failed to load chat');
        } finally {
            setLoading(false);
        }
    };
    
    // Handle sending a new message
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newMessage.trim() || !id || !user) return;

        const messageData = {
            chatId: parseInt(id),
            message: {
                senderId: user.userDetails.id,
                message: newMessage.trim(),
                isRead: false
            }
        };
        
        // Use socket to send message
        if (socket) {
            socket.emit('send-message', messageData);
            setNewMessage('');
        } else {
            // Fallback to REST API if socket is not available
            try {
                await sendMessage(parseInt(id), messageData.message);
                fetchChat(); // Refresh chat to see the new message
                setNewMessage('');
            } catch (err) {
                console.error('Error sending message:', err);
                setError('Failed to send message');
            }
        }
    };
    
    // Join chat room when component mounts or chat ID changes
    useEffect(() => {
        if (socket && id) {
            socket.emit('join-chat', id);
            
            return () => {
                socket.emit('leave-chat', id);
            };
        }
    }, [socket, id]);
    
    // Listen for new messages
    useEffect(() => {
        if (!socket) return;
        
        const handleNewMessage = (message: IMessage) => {
            // Only update if this message belongs to our current chat
            if (message.chatId.toString() === id) {
                setChat(prevChat => {
                    if (!prevChat) return null;
                    
                    return {
                        ...prevChat,
                        messages: [...(prevChat.messages || []), message],
                        lastMessage: message.message
                    };
                });
            }
        };
        
        socket.on('new-message', handleNewMessage);
        
        return () => {
            socket.off('new-message', handleNewMessage);
        };
    }, [socket, id]);
    
    // Initial fetch
    useEffect(() => {
        fetchChat();
    }, [id]);
    
    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [chat?.messages]);

    useEffect(() => {
        const fetchOtherUserName = async () => {
            if (!chat) return;
            const otherUserId = chat.users.find(userId => userId !== user.userDetails.id) || null;
            if (otherUserId) {
                const otherUserName = await getUserById(otherUserId);
                setChatName(otherUserName ? `Chat with ${otherUserName.userDetails.fname} ${otherUserName.userDetails.sname}` : 'Chat');
            }
        };
        fetchOtherUserName();
    }, [chat, user]);
    
    if (loading) {
        return <div className={styles.chatLoading}>Loading chat...</div>;
    }
    
    if (error) {
        return <div className={styles.chatError}>{error}</div>;
    }
    
    if (!chat) {
        return <div className={styles.chatError}>Chat not found</div>;
    }
    
    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
                <h2>{chatName}</h2>
            </div>
            
            <div className={styles.messagesContainer}>
                {chat.messages && chat.messages.length > 0 ? (
                    chat.messages.map((message, index) => (
                        <div 
                            key={index}
                            className={`${styles.message} ${
                                message.userId !== user.userDetails.id
                                    ? styles.sentMessage 
                                    : styles.receivedMessage
                            }`}
                        >
                            <p className={styles.messageContent}>{message.message}</p>
                            <span className={styles.messageTime}>
                                {formatTime(message.timestamp)}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className={styles.noMessages}>
                        No messages yet. Start the conversation!
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            
            <form className={styles.messageForm} onSubmit={handleSendMessage}>
                <input
                    type="text"
                    className={styles.messageInput}
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button 
                    type="submit" 
                    className={styles.sendButton}
                    disabled={!newMessage.trim()}
                >
                    Send
                </button>
            </form>
        </div>
    );
}

export default ChatPage;