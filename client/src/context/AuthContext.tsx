"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    _id?: string;
    name: string;
    role: 'student' | 'faculty' | 'hod' | 'class_incharge';
    department: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    selectedRole: 'faculty' | 'incharge' | null;
    setSelectedRole: (role: 'faculty' | 'incharge' | null) => void;
    login: (token: string, user: User) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<'faculty' | 'incharge' | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('selectedRole') as 'faculty' | 'incharge' | null;

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            if (storedRole) setSelectedRole(storedRole);
        }
        setLoading(false);
    }, []);

    const handleSetSelectedRole = (role: 'faculty' | 'incharge' | null) => {
        setSelectedRole(role);
        if (role) localStorage.setItem('selectedRole', role);
        else localStorage.removeItem('selectedRole');
    };

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));

        // Redirect based on role
        if (newUser.role === 'hod') {
            router.push('/hod');
        } else if (newUser.role === 'class_incharge') {
            router.push('/role-selection');
        } else if (newUser.role === 'faculty') {
            handleSetSelectedRole('faculty');
            router.push('/faculty');
        } else if (newUser.role === 'student') {
            router.push('/student');
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        handleSetSelectedRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('selectedRole');
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            selectedRole,
            setSelectedRole: handleSetSelectedRole,
            login,
            logout,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
