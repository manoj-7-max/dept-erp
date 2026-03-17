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
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            return JSON.parse(userInfo).name;
        }
        return 'Student';
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
