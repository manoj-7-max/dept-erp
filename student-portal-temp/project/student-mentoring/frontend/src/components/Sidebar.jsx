import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    User,
    UserCheck,
    FileText,
    Users,
    Award,
    Activity,
    MessageSquare,
    FileSignature,
    CheckSquare,
    Video,
    FolderOpen,
    Target,
    Star,
    Clock
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const pathname = usePathname();
    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <h2>Student Portal</h2>
                <span>Dashboard</span>
            </div>

            <nav className="sidebar-nav">
                <Link href="/dashboard/profile" className={pathname === '/dashboard/profile' ? 'nav-item active' : 'nav-item'}>
                    <User size={20} className="nav-icon" />
                    <span>Profile</span>
                </Link>

                <Link href="/dashboard/mentor" className={pathname === '/dashboard/mentor' ? 'nav-item active' : 'nav-item'}>
                    <UserCheck size={20} className="nav-icon" />
                    <span>My Mentor</span>
                </Link>

                <Link href="/dashboard/academic-records" className={pathname === '/dashboard/academic-records' ? 'nav-item active' : 'nav-item'}>
                    <FileText size={20} className="nav-icon" />
                    <span>Academic Records</span>
                </Link>


                <Link href="/dashboard/activities" className={pathname === '/dashboard/activities' ? 'nav-item active' : 'nav-item'}>
                    <Award size={20} className="nav-icon" />
                    <span>Co-Curricular</span>
                </Link>

                <Link href="/dashboard/circular" className={pathname === '/dashboard/circular' ? 'nav-item active' : 'nav-item'}>
                    <FileSignature size={20} className="nav-icon" />
                    <span>Circular</span>
                </Link>

                <Link href="/dashboard/behaviour" className={pathname === '/dashboard/behaviour' ? 'nav-item active' : 'nav-item'}>
                    <Activity size={20} className="nav-icon" />
                    <span>Academic Behaviour</span>
                </Link>

                <Link href="/dashboard/concerns" className={pathname === '/dashboard/concerns' ? 'nav-item active' : 'nav-item'}>
                    <MessageSquare size={20} className="nav-icon" />
                    <span>Personal Concerns</span>
                </Link>

                <div className="sidebar-divider"></div>

                <Link href="/dashboard/attendance" className={pathname === '/dashboard/attendance' ? 'nav-item active' : 'nav-item'}>
                    <CheckSquare size={20} className="nav-icon" />
                    <span>Attendance</span>
                </Link>

                <Link href="/dashboard/documents" className={pathname === '/dashboard/documents' ? 'nav-item active' : 'nav-item'}>
                    <FolderOpen size={20} className="nav-icon" />
                    <span>Documents</span>
                </Link>

                <Link href="/dashboard/goals" className={pathname === '/dashboard/goals' ? 'nav-item active' : 'nav-item'}>
                    <Target size={20} className="nav-icon" />
                    <span>Student Goals</span>
                </Link>

                <Link href="/dashboard/feedback" className={pathname === '/dashboard/feedback' ? 'nav-item active' : 'nav-item'}>
                    <Star size={20} className="nav-icon" />
                    <span>Feedback</span>
                </Link>

                <Link href="/dashboard/timeline" className={pathname === '/dashboard/timeline' ? 'nav-item active' : 'nav-item'}>
                    <Clock size={20} className="nav-icon" />
                    <span>Activity Timeline</span>
                </Link>

            </nav>
        </div>
    );
};

export default Sidebar;
