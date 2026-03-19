"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { BACKEND_URL } from '@/config/apiConfig';

interface SocketContextType {
    socket: Socket | null;
    notifications: any[];
}

const SocketContext = createContext<SocketContextType>({ socket: null, notifications: [] });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const { user, token } = useAuth();

    useEffect(() => {
        // Only connect if user is authenticated
        if (!user || !token) return;

        // Connect to the backend URL from environment variables, falling back to local
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || BACKEND_URL;
        const socketInstance = io(backendUrl);

        socketInstance.on('connect', () => {
            // Identify the user to the server so they get personal + role-wide alerts
            socketInstance.emit('join', user.id || user._id);
            if (user.role) socketInstance.emit('join_role', user.role.toLowerCase());
        });

        socketInstance.on('notification', (data) => {
            setNotifications((prev) => [data, ...prev]);

            // Real-time Toast Notification Logic
            if (data.type === 'Alert' || data.type === 'Request_Created') {
                toast(data.message, { icon: '🔔', duration: 4000 });
            } else if (data.type === 'Request_Approved') {
                toast.success(data.message, { duration: 4000 });
            } else if (data.type === 'Request_Rejected') {
                toast.error(data.message, { duration: 4000 });
            } else {
                toast(data.title + ": " + data.message);
            }
        });

        socketInstance.on('new_message', (message: any) => {
            // Show toast if chat is not open or from different user
            // For now, just show a simple toast
            toast(`New message from ${message.sender.name}`, {
                icon: '💬',
                duration: 3000
            });
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [user, token]);

    return (
        <SocketContext.Provider value={{ socket, notifications }}>
            {children}
        </SocketContext.Provider>
    );
};