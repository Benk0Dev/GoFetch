import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { IChat, IMessage } from "../../models/IMessage";
import { getChatById, sendMessage } from "../../services/Registry";
import styles from './MessagingPage.module.css';

function ChatPage() {
    const { id } = useParams<{id: string}>();
    const [chat, setChat] = useState<IChat | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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

    if (loading) {
        return <div>Loading chat...</div>;
    }

    if (!chat) {
        return <div>Chat not found</div>;
    }

    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
                <h2>Chat with {chat.users.join(", ")}</h2>
            </div>
            
            <div className={styles.messagesContainer}>
                {chat.messages && chat.messages.length > 0 ? (
                    chat.messages.map((message: IMessage) => (
                        <div 
                            key={message.id} 
                            className={`${styles.message} ${
                                message.userId === parseInt(localStorage.getItem('userID') || '0') 
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