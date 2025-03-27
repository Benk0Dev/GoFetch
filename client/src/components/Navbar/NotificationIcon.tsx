import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DropdownMenu from "../Dropdown/DropdownMenu";
import DropdownItem from "../Dropdown/DropdownItem";
import styles from "./Navbar.module.css";
import { Bell } from "lucide-react";
import { getUserNotifications, markNotificationAsRead } from "../../services/Registry";
import { INotification } from "../../models/INotification";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
import NotificationContainer from "../Notifications/NotificationContainer";

function NotificationIcon() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [loading, setLoading] = useState(true);
    const menuRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLButtonElement>(null);
    const navigate = useNavigate();
    const { socket, isConnected } = useSocket();
    const { user } = useAuth();

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const fetchNotifications = async () => {
        setLoading(true);
        const result = await getUserNotifications();
        if (result && result.notifications) {
            // Sort notifications by createdAt date (newest first)
            const sortedNotifications = result.notifications.sort(
                (a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setNotifications(sortedNotifications);
        }
        setLoading(false);
    };

    // Handle notification click
    const handleNotificationClick = async (notification: INotification) => {
        // Mark as read
        await markNotificationAsRead(notification.id);
        
        // Navigate based on notification type
        switch (notification.type) {
            case "message":
                navigate(`/chats/${notification.linkId}`);
                break;
            case "booking":
                navigate(`/dashboard?booking=${notification.linkId}`);
                break;
            case "review":
                navigate(`/profile#reviews`);
                break;
            case "payment":
                navigate(`/dashboard?payment=${notification.linkId}`);
                break;
            default:
                navigate('/dashboard');
        }
        
        // Close menu
        toggleMenu();
        
        // Refresh notifications
        fetchNotifications();
    };

    // Setup socket listeners for real-time notifications
    useEffect(() => {
        if (!socket || !isConnected) return;
        
        // Handler for new notifications
        const handleNewNotification = (newNotification: INotification) => {
            console.log('Received new notification:', newNotification);
            
            // Add notification to state if it's for this user
            if (user?.id === newNotification.userId) {
                setNotifications(prev => {
                    // Add new notification and re-sort (newest first)
                    const updated = [newNotification, ...prev];
                    return updated.sort(
                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                });
            }
        };
        
        // Subscribe to notification events
        socket.on('new-notification', handleNewNotification);
        
        // Cleanup
        return () => {
            socket.off('new-notification', handleNewNotification);
        };
    }, [socket, isConnected, user]);

    // Initial fetch and periodic refresh as a fallback
    useEffect(() => {
        fetchNotifications();
        
        // Poll for new notifications every 60 seconds as a fallback
        // This ensures notifications aren't missed if socket connection fails
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef?.current && !menuRef.current.contains(event.target as Node) && 
                iconRef?.current !== event.target) {
                setMenuOpen(false);
            }
        }

        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    // Count unread notifications
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <>
            <div className={styles.dropdownContainer} ref={menuRef}>
                <button 
                    ref={iconRef} 
                    className="btn-round btn-transparent" 
                    onClick={toggleMenu}
                    style={{ position: 'relative' }}
                >
                    <Bell strokeWidth={2.25} />
                    {unreadCount > 0 && (
                        <span className={styles.notificationBadge}>
                            {unreadCount}
                        </span>
                    )}
                </button>
                {menuOpen && (
                    <DropdownMenu onClose={toggleMenu}>
                        <div className={styles.notificationHeader}>
                            <h4>Notifications</h4>
                        </div>
                        
                        {loading ? (
                            <DropdownItem text="Loading notifications..." onClick={() => {}} />
                        ) : notifications.length > 0 ? (
                            <>
                                {notifications.map(notification => (
                                    <div 
                                        key={notification.id} 
                                        className={styles.notificationItem}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className={`${styles.notificationContent} ${!notification.read ? styles.unread : ''}`}>
                                            <p>{notification.message}</p>
                                            <span className={styles.notificationTime}>
                                                {new Date(notification.createdAt).toLocaleDateString()} 
                                                {' '}
                                                {new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <DropdownItem text="You have no notifications" onClick={() => {}} />
                        )}
                    </DropdownMenu>
                )}
            </div>
            
            {/* Add the notification popup container */}
            <NotificationContainer notifications={notifications} />
        </>
    );
}

export default NotificationIcon;