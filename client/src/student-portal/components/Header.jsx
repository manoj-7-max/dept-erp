import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Menu } from 'lucide-react';
import { logout } from '../services/api';
import './Header.css';

const Header = ({ toggleSidebar }) => {
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const getStudentName = () => {
        // Next.js Server-Side Rendering check
        if (typeof window !== 'undefined') {
            // Check for Unified User info first
            const user = localStorage.getItem('user');
            if (user) {
                try {
                    return JSON.parse(user).name || 'Student';
                } catch(e) {}
            }

            // Fallback to Legacy Student Token
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                try {
                    return JSON.parse(userInfo).name || 'Student';
                } catch(e) {}
            }
        }
        return 'Student'; // Fallback text while loading
    };

    return (
        <header className="header">
            <div className="header-left">
                <button className="menu-btn" onClick={toggleSidebar}>
                    <Menu size={24} />
                </button>
                <h2 className="header-title">Student Dashboard</h2>
            </div>

            <div className="header-right">
                <span className="user-greeting">Welcome, <strong>{getStudentName()}</strong></span>
                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={18} style={{ marginRight: '6px' }} />
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
