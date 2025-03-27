import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, Outlet, useParams, useNavigate } from "react-router-dom";
import { IChat } from "@gofetch/models/IMessage";
import { Role } from "@gofetch/models/IUser";
import { getUserChats, getUserByIdWithPictures } from "@client/services/Registry";
import styles from '@client/pages/MessagingPage/MessagingPage.module.css';
import { useAuth } from "@client/context/AuthContext";
import { useSocket } from "@client/context/SocketContext";

function MessagingPage() {
    const [chats, setChats] = useState<IChat[]>([]);
    const [loading, setLoading] = useState(true);
    const [chatUserNames, setChatUserNames] = useState<{[chatId: string]: string}>({});
    const [socketInfo, setSocketInfo] = useState<string>('Initializing socket...');
    const { id } = useParams<{id: string}>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { socket, isConnected, connectionError } = useSocket();

    // Memoize the current user ID to prevent unnecessary effect triggers
    const currentUserId = useMemo(() => user.id, [user.id]);

    useEffect(() => {
        console.log(socketInfo);
    }, [socketInfo]);

    // Debug logger for socket state changes
    useEffect(() => {
        console.log("Socket state changed:", { 
            exists: !!socket, 
            isConnected, 
            error: connectionError,
            id: socket?.id 
        });
        
        if (connectionError) {
            setSocketInfo(`Error: ${connectionError}`);
        } else if (isConnected && socket) {
            setSocketInfo(`Connected: ID=${socket.id}`);
        } else {
            setSocketInfo('Waiting for connection...');
        }
    }, [socket, isConnected, connectionError]);

    const fetchChats = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getUserChats();
            if (data && data.chats) {
                setChats(data.chats);
                
                // If no chat is selected and we have chats, select the first one
                if (!id && data.chats.length > 0) {
                    navigate(`/chats/${data.chats[0].id}`);
                }
            }
        } catch (error) {
            console.error("Error fetching chats:", error);
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    // Fetch chat user names only when necessary
    const fetchChatUserNames = useCallback(async () => {
        const pendingChats = chats.filter(chat => !chatUserNames[chat.id.toString()]);
        
        if (pendingChats.length === 0) return;
        
        const namesMap = {...chatUserNames};
        
        for (const chat of pendingChats) {
            const otherUserId = chat.users.find(userId => userId !== currentUserId) || null;
            
            if (otherUserId) {
                try {
                    const otherUser = await getUserByIdWithPictures(otherUserId);
                    if (otherUser) {
                        let name = `${otherUser.name.fname} ${otherUser.name.sname}`;
                        if (otherUser.roles.includes(Role.ADMIN)) {
                            name += " (Admin)";
                        }
                        namesMap[chat.id.toString()] = name;
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

    // Setup socket event listeners
    useEffect(() => {
        if (!socket) return;

        // Listen for chat updates
        const handleChatUpdated = (updatedChat: IChat) => {
            setChats(prevChats => {
                // Find and update the specific chat
                const chatIndex = prevChats.findIndex(chat => chat.id === updatedChat.id);
                
                if (chatIndex !== -1) {
                    const newChats = [...prevChats];
                    newChats[chatIndex] = updatedChat;
                    return newChats;
                }
                
                // If it's a new chat, add it
                return [...prevChats, updatedChat];
            });
        };

        // Listen for new chats
        const handleNewChat = (newChat: IChat) => {
            setChats(prevChats => {
                // Check if this chat already exists
                if (!prevChats.some(chat => chat.id === newChat.id)) {
                    return [...prevChats, newChat];
                }
                return prevChats;
            });
        };

        socket.on('chat-updated', handleChatUpdated);
        socket.on('new-chat', handleNewChat);

        return () => {
            socket.off('chat-updated', handleChatUpdated);
            socket.off('new-chat', handleNewChat);
        };
    }, [socket]);

    // Fetch user names only when we have new chats without names
    useEffect(() => {
        if (chats.length > 0) {
            fetchChatUserNames();
        }
    }, [chats, fetchChatUserNames]);

    if (loading && chats.length === 0) {
        return null;
    }

    return (
        <div className={styles.messagingContainer}>
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
                        {user.currentRole === Role.OWNER && (
                            <Link to="/browse" className="btn btn-primary">
                            Browse Pet Minders
                            </Link>
                        )}
                        
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