import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { IChat, IMessage } from "../../models/IMessage";
import { getChatById, sendMessage, getUserById } from "../../services/Registry";
import { useAuth } from "../../context/AuthContext";
import styles from './MessagingPage.module.css';

function ChatPage() {
    const { id } = useParams<{id: string}>();
    const [chat, setChat] = useState<IChat | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [otherUserName, setOtherUserName] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();

    async function fetchChat() {
        if (!id) return;
        
        setLoading(true);
        const data = await getChatById(parseInt(id));
        if (data) {
            setChat(data);
        }
        setLoading(false);
    }

    async function handleSendMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!newMessage.trim() || !id) return;

        const sent = await sendMessage(parseInt(id), newMessage);
        if (sent) {
            setNewMessage("");
            // Refetch the chat to get the updated messages
            fetchChat();
        }
    }

    useEffect(() => {
        fetchChat();
        // Set up polling to refresh messages every 5 seconds
        const interval = setInterval(fetchChat, 5000);
        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
    }, [chat?.messages]);

    useEffect(() => {
        async function fetchOtherUser() {
            if (!chat) return;
            console.log(user)
            const userId = user.userDetails.id;
            console.log(userId)
            const currentUserId = user.userDetails.id;
            // Find the ID of the other user in the chat (not the current user)
            const otherUserId = chat.users.find(id => id !== currentUserId) || null;
            
            if (otherUserId) {
                const otherUser = await getUserById(otherUserId);
                if (otherUser) {
                    setOtherUserName(`${otherUser.userDetails.fname} ${otherUser.userDetails.sname}`);
                }
            }
        }
        
        fetchOtherUser();
    }, [chat]);

    if (loading) {
        return <div className={styles.chatLoading}>Loading conversation...</div>;
    }

    if (!chat) {
        return <div className={styles.chatError}>Conversation not found</div>;
    }

    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
                {otherUserName || "Loading..."}
            </div>
            
            <div className={styles.messagesContainer}>
                {chat.messages && chat.messages.length > 0 ? (
                    chat.messages.map((message: IMessage) => (
                        <div 
                            key={message.id} 
                            className={`${styles.message} ${
                                message.userId === user.userDetails.id
                                ? styles.sentMessage 
                                : styles.receivedMessage
                            }`}
                        >
                            <p className={styles.messageContent}>{message.message}</p>
                            <span className={styles.messageTime}>
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className={styles.noMessages}>No messages yet. Send the first one!</p>
                )}
                <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className={styles.messageForm}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className={styles.messageInput}
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