import { useEffect, useState, useCallback, useMemo } from "react";
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

    // Memoize the current user ID to prevent unnecessary effect triggers
    const currentUserId = useMemo(() => user.userDetails.id, [user.userDetails.id]);

    // Use useCallback to memoize the fetchChats function
    const fetchChats = useCallback(async (shouldSetLoading = true) => {
        if (shouldSetLoading) {
            setLoading(true);
        }
        
        const data = await getUserChats();
        if (data && data.chats) {
            // Only update state if chats have actually changed
            if (JSON.stringify(data.chats) !== JSON.stringify(chats)) {
                setChats(data.chats);
                
                // If no chat is selected and we have chats, select the first one
                if (!id && data.chats.length > 0) {
                    navigate(`/chats/${data.chats[0].id}`);
                }
            }
        }
        
        if (shouldSetLoading) {
            setLoading(false);
        }
    }, [chats, id, navigate]);

    // Fetch chat user names only when necessary
    const fetchChatUserNames = useCallback(async () => {
        const pendingChats = chats.filter(chat => !chatUserNames[chat.id.toString()]);
        
        if (pendingChats.length === 0) return;
        
        const namesMap = {...chatUserNames};
        
        for (const chat of pendingChats) {
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
    }, [chats, chatUserNames, currentUserId]);

    // Initial fetch
    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    // Set up polling to refresh chats - with silent updates
    useEffect(() => {
        const interval = setInterval(() => fetchChats(false), 10000);
        return () => clearInterval(interval);
    }, [fetchChats]);

    // Fetch user names only when we have new chats without names
    useEffect(() => {
        if (chats.length > 0) {
            fetchChatUserNames();
        }
    }, [chats, fetchChatUserNames]);

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