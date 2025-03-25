import { useEffect, useState } from "react";
import { Link, Outlet, useParams, useNavigate } from "react-router-dom";
import { IChat } from "../../models/IMessage";
import { getUserChats, getUserById } from "../../services/Registry";
import styles from './MessagingPage.module.css';
import { useAuth } from "../../context/AuthContext";

function MessagingPage() {
    const [chats, setChats] = useState<IChat[]>([]);
    const [loading, setLoading] = useState(true);
    const [chatUserNames, setChatUserNames] = useState<{[chatId: string]: string}>({});
    const { id } = useParams<{id: string}>();
    const navigate = useNavigate();
    const { user } = useAuth();

    async function fetchChats() {
        setLoading(true);
        const data = await getUserChats();
        if (data && data.chats) {
            setChats(data.chats);
            
            // If no chat is selected and we have chats, select the first one
            if (!id && data.chats.length > 0) {
                navigate(`/chats/${data.chats[0].id}`);
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchChats();
        // Set up polling to refresh chats every 10 seconds
        const interval = setInterval(fetchChats, 10000);
        return () => clearInterval(interval);
    }, []);

    // Fetch user names for all chats
    useEffect(() => {
        async function fetchChatUserNames() {
            const currentUserId = user.userDetails.id;
            const namesMap: {[chatId: string]: string} = {};
            
            for (const chat of chats) {
                const otherUserId = chat.users.find(userId => userId !== currentUserId) || null;
                
                if (otherUserId) {
                    try {
                        const otherUser = await getUserById(otherUserId);
                        if (otherUser && otherUser.userDetails) {
                            namesMap[chat.id.toString()] = 
                                `${otherUser.userDetails.fname} ${otherUser.userDetails.sname}`;
                        } else {
                            namesMap[chat.id.toString()] = "Unknown User";
                        }
                    } catch (error) {
                        console.error("Error fetching user:", error);
                        namesMap[chat.id.toString()] = "Unknown User";
                    }
                } else {
                    namesMap[chat.id.toString()] = "Unknown User";
                }
            }
            
            setChatUserNames(namesMap);
        }
        
        if (chats.length > 0) {
            fetchChatUserNames();
        }
    }, [chats]);

    if (loading && chats.length === 0) {
        return <div>Loading chats...</div>;
    }

    return (
        <div className={styles.messagingContainer}>
            {/* Chat list sidebar */}
            <div className={styles.chatsSidebar}>
                <h2>Chats</h2>
                
                {chats.length > 0 ? (
                    <div className={styles.chatsList}>
                        {chats.map((chat: IChat) => (
                            <Link 
                                to={`/chats/${chat.id}`} 
                                key={chat.id} 
                                className={`${styles.chatListItem} ${id === chat.id?.toString() ? styles.activeChatItem : ''}`}
                            >
                                <div className={styles.chatPreview}>
                                    <h3>
                                        {chatUserNames[chat.id.toString()] || 
                                            <span className={styles.loadingName}>Loading...</span>}
                                    </h3>
                                    <p className={styles.previewMessage}>
                                        {chat.lastMessage || "No messages yet"}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className={styles.noChats}>
                        <p>No conversations yet</p>
                        <Link to="/browse" className={styles.browseButton}>
                            Browse Pet Minders
                        </Link>
                    </div>
                )}
            </div>
            
            {/* Chat window - will display the Outlet (ChatPage) */}
            <div className={styles.chatWindowContainer}>
                {id ? (
                    <Outlet />
                ) : (
                    <div className={styles.noChatSelected}>
                        <p>Select a conversation</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MessagingPage;