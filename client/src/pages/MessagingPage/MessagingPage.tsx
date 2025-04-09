import { useEffect, useState, useCallback, useMemo, use } from "react";
import { Link, Outlet, useParams, useNavigate } from "react-router-dom";
import { IChat, IMessage } from "@gofetch/models/IMessage";
import { Role } from "@gofetch/models/IUser";
import { getUserByIdWithPictures } from "@client/services/UserRegistry";
import { getSortedUserChats } from "@client/services/ChatRegistry";
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

    const maxMobileWidth = 768; // Define a constant for mobile width
    const [isMobile, setIsMobile] = useState(window.innerWidth <= maxMobileWidth);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= maxMobileWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
            const data = await getSortedUserChats();
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
    }, [chats, chatUserNames, currentUserId, isMobile]);

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
                console.log("Chat updated:", updatedChat, chatIndex);
                if (chatIndex !== -1) {
                    const newChats = [...prevChats];
                    // Only update the unread count for the current user
                    newChats[chatIndex] = {
                        ...updatedChat,
                        unreadCount: updatedChat.unreadCounts?.[currentUserId] || 0,
                        isRead: updatedChat.userReadStatus?.[currentUserId] || false
                    };
                    return newChats;
                }
                
                // If it's a new chat, add it with the correct unread count
                return [...prevChats, {
                    ...updatedChat,
                    unreadCount: updatedChat.unreadCounts?.[currentUserId] || 0,
                    isRead: updatedChat.userReadStatus?.[currentUserId] || false
                }];
            });
        };

        // Listen for new chats
        const handleNewChat = (newChat: IChat) => {
            setChats(prevChats => {
                // Check if this chat already exists
                if (!prevChats.some(chat => chat.id === newChat.id)) {
                    return [...prevChats, {
                        ...newChat,
                        unreadCount: newChat.unreadCounts?.[currentUserId] || 0,
                        isRead: newChat.userReadStatus?.[currentUserId] || false
                    }];
                }
                return prevChats;
            });
        };

        const handleNewMessage = (message: IMessage) => {
            console.log("New message received:", message);
            
            setChats(prevChats => {
                // First update the chat that received the message
                const updatedChats = prevChats.map(chat => {
                    if (chat.id === message.chatId) {
                        // Only increment unread count if message is not from current user
                        const unreadCount = message.senderId !== currentUserId ? 
                            (chat.unreadCount || 0) + 1 : chat.unreadCount;
                            
                        return {
                            ...chat,
                            lastMessage: message.message,
                            lastMessageDate: message.timestamp || new Date(),
                            unreadCount: unreadCount,
                            isRead: message.senderId === currentUserId
                        };
                    }
                    return chat;
                });
                
                // Then create a new sorted array
                return [...updatedChats].sort((a, b) => {
                    const aDate = a.lastMessageDate ? new Date(a.lastMessageDate).getTime() : 0;
                    const bDate = b.lastMessageDate ? new Date(b.lastMessageDate).getTime() : 0;
                    return bDate - aDate; // Most recent first
                });
            });
        };

        const handleMessageRead = (data: {chatId: number, messageId: number, userId: number}) => {
            // Only update the UI if the current user is the one who read the message
            if (data.userId === currentUserId) {
                setChats(prevChats => {
                    return prevChats.map(chat => {
                        if (chat.id === data.chatId) {
                            // Update the unread count and read status
                            return {
                                ...chat,
                                unreadCount: 0,
                                isRead: true
                            };
                        }
                        return chat;
                    });
                });
            }
        };

        socket.on('chat-update', handleChatUpdated);
        socket.on('new-chat', handleNewChat);
        socket.on('new-message', handleNewMessage);
        socket.on('message-read', handleMessageRead);

        return () => {
            socket.off('chat-update', handleChatUpdated);
            socket.off('new-chat', handleNewChat);
            socket.off('new-message', handleNewMessage);
            socket.off('message-read', handleMessageRead);
        };
    }, [socket, currentUserId]);

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
        <div className={`container ${styles.messagingPage}`}>
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
                                        <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", width: '100%' }}>
                                            {isMobile ? (
                                                chatUserNames[chat.id.toString()] ? chatUserNames[chat.id.toString()].split(' ').slice(0, 2).map(part => part.charAt(0)).join('') : <span className={styles.loadingName}>Loading...</span>
                                            ) : (
                                                chatUserNames[chat.id.toString()] || <span className={styles.loadingName}>Loading...</span>
                                            )}
                                            {chat.unreadCount > 0 && (
                                                <span className={styles.unreadBadge}>{chat.unreadCount}</span>
                                            )}
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
                            <p>{isMobile ? "..." : "No conversations yet"}</p>
                            {user.currentRole === Role.OWNER && (
                                <Link to="/browse" className="btn btn-primary">
                                Browse Pet Minders
                                </Link>
                            )}
                            
                        </div>
                    )}
                </div>
                
                {/* Chat window - will display the Outlet (Chat) */}
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
        </div>
    );
}

export default MessagingPage;