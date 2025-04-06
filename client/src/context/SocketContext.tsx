import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@client/context/AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connectionError: string | null;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connectionError: null,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Clean up any existing socket first
    if (socketRef.current) {
      console.log("Cleaning up existing socket connection");
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // Use explicit URL - this is crucial
    const SOCKET_URL = "http://localhost:3001";
    console.log(`Attempting socket connection to: ${SOCKET_URL}`);

    try {
      // Create socket with explicit options
      const newSocket = io(SOCKET_URL, {
        transports: ["polling", "websocket"], // Try polling first, then websocket
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
        timeout: 20000,
        forceNew: true,
        autoConnect: true,
      });

      // Log all socket events for debugging
      newSocket.onAny((event, ...args) => {
        console.log(`[Socket Event] ${event}:`, args);
      });

      // Handle connection events
      newSocket.on("connect", () => {
        console.log(`Socket connected successfully with ID: ${newSocket.id}`);
        setIsConnected(true);
        setConnectionError(null);

        // Register user after successful connection
        if (user) {
          console.log(`Registering user ${user.id} with socket`);
          newSocket.emit("register-user", user.id);
        }
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connect_error:", error.message);
        setConnectionError(`Connection error: ${error.message}`);
        setIsConnected(false);
      });

      newSocket.on("disconnect", (reason) => {
        console.log(`Socket disconnected: ${reason}`);
        setIsConnected(false);
        setConnectionError(`Disconnected: ${reason}`);
      });

      newSocket.on("reconnect_attempt", (attempt) => {
        console.log(`Socket reconnection attempt ${attempt}`);
      });

      newSocket.on("reconnect", (attempt) => {
        console.log(`Socket reconnected after ${attempt} attempts`);
        setIsConnected(true);
        setConnectionError(null);
      });

      newSocket.on("reconnect_failed", () => {
        console.log("Socket reconnection failed");
        setConnectionError("Reconnection failed after multiple attempts");
      });

      newSocket.on("error", (error) => {
        console.error("Socket error:", error);
        setConnectionError(`Socket error: ${error}`);
      });

      // Store socket in state and ref
      socketRef.current = newSocket;
      setSocket(newSocket);

      // Clean up function
      return () => {
        console.log("Socket provider unmounting, cleaning up socket");
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current.removeAllListeners();
          socketRef.current = null;
          setSocket(null);
          setIsConnected(false);
        }
      };
    } catch (error) {
      console.error("Error creating socket:", error);
      setConnectionError(`Failed to create socket: ${error}`);
      return () => {}; // Return empty cleanup function
    }
  }, [user]); // Only recreate when user changes

  return (
    <SocketContext.Provider value={{ socket, isConnected, connectionError }}>
      {children}
    </SocketContext.Provider>
  );
};
