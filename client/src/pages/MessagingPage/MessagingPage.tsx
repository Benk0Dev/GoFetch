import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getChatById, sendMessage, getUserByIdWithPictures } from '@client/services/Registry';
import { IChat, IMessage } from '@gofetch/models/IMessage';
import { useAuth } from '@client/context/AuthContext';
import { useSocket } from '@client/context/SocketContext';
import styles from '@client/pages/MessagingPage/MessagingPage.module.css';

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
    const [userPicture, setUserPicture] = useState<string>("");
    
    // Format timestamp to readable format
    const formatMessageTime = (timestamp: Date | string) => {
        const messageDate = new Date(timestamp);
        const today = new Date();
        
        // Check if the message is from today
        const isToday = messageDate.getDate() === today.getDate() &&
                        messageDate.getMonth() === today.getMonth() &&
                        messageDate.getFullYear() === today.getFullYear();
        
        if (isToday) {
            // Just show time for today's messages
            return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            // Show date and time for older messages
            return `${messageDate.toLocaleDateString([], { 
                month: 'short', 
                day: 'numeric',
                year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
            })} ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
    };
    
    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ block: 'end' });
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
                senderId: user.id,
                message: newMessage.trim(),
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
        const fetchOtherUserInfo = async () => {
            if (!chat) return;
            const otherUserId = chat.users.find(userId => userId !== user.id) || null;
            if (otherUserId) {
                const otherUser = await getUserByIdWithPictures(otherUserId);
                setChatName(otherUser ? `${otherUser.name.fname} ${otherUser.name.sname}` : 'Chat');
                setUserPicture(otherUser && otherUser.primaryUserInfo.profilePic);
            }
        };
        fetchOtherUserInfo();
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
                <Link to={`/users/${chat.users.find(userId => userId !== user.id)}`} className={styles.backButton}>
                    <img 
                        src={userPicture} 
                        alt="User" 
                    />
                    <h2>{chatName}</h2>
                </Link>
            </div>
            
            <div className={styles.messagesContainer}>
                {chat.messages && chat.messages.length > 0 ? (
                    chat.messages.map((message, index) => (
                        <div 
                            key={index}
                            className={`${styles.message} ${
                                message.senderId === user.id
                                    ? styles.sentMessage 
                                    : styles.receivedMessage
                            }`}
                        >
                            <p className={styles.messageContent}>{message.message}</p>
                            <span className={styles.messageTime}>
                                {formatMessageTime(message.timestamp)}
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
                    className={`btn btn-primary ${styles.sendButton}`}
                    disabled={!newMessage.trim()}
                >
                    Send
                </button>
            </form>
        </div>
    );
}

export default ChatPage;