import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IChat } from "../../models/IMessage";
import { getUserChats } from "../../services/Registry";
import styles from './MessagingPage.module.css';

function ChatsPage() {
    const [chats, setChats] = useState<IChat[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchChats() {
        setLoading(true);
        const data = await getUserChats();
        if (data && data.chats) {
            setChats(data.chats);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchChats();
        // Set up polling to refresh chats every 5 seconds
        // const interval = setInterval(fetchChats, 5000);
        // return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div>Loading chats...</div>;
    }

    return (
        <div className={styles.pageContainer}>
            <h1>Your Conversations</h1>
            
            {chats.length > 0 ? (
                <div className={styles.chatsContainer}>
                    {chats.map((chat: IChat) => (
                        <Link 
                            to={`/chats/${chat.id}`} 
                            key={chat.id} 
                            className={styles.chatItem}
                        >
                            <div className={styles.chatDetails}>
                                <h3>Chat with {chat.users.join(", ")}</h3>
                                <p className={styles.lastMessage}>
                                    {chat.lastMessage || "No messages yet"}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className={styles.noChats}>
                    <p>No conversations yet</p>
                    <p>Start chatting with pet minders by browsing available services</p>
                    <Link to="/browse" className={styles.browseButton}>
                        Browse Pet Minders
                    </Link>
                </div>
            )}
        </div>
    );
}

export default ChatsPage;