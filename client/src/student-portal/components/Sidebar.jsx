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
                <Link href="/student/dashboard/profile" className={pathname === '/student/dashboard/profile' ? 'nav-item active' : 'nav-item'}>
                    <User size={20} className="nav-icon" />
                    <span>Profile</span>
                </Link>

                <Link href="/student/dashboard/mentor" className={pathname === '/student/dashboard/mentor' ? 'nav-item active' : 'nav-item'}>
                    <UserCheck size={20} className="nav-icon" />
                    <span>My Mentor</span>
                </Link>

                <Link href="/student/dashboard/academic-records" className={pathname === '/student/dashboard/academic-records' ? 'nav-item active' : 'nav-item'}>
                    <FileText size={20} className="nav-icon" />
                    <span>Academic Records</span>
                </Link>


                <Link href="/student/dashboard/activities" className={pathname === '/student/dashboard/activities' ? 'nav-item active' : 'nav-item'}>
                    <Award size={20} className="nav-icon" />
                    <span>Co-Curricular</span>
                </Link>

                <Link href="/student/dashboard/circular" className={pathname === '/student/dashboard/circular' ? 'nav-item active' : 'nav-item'}>
                    <FileSignature size={20} className="nav-icon" />
                    <span>Circular</span>
                </Link>

                <Link href="/student/dashboard/behaviour" className={pathname === '/student/dashboard/behaviour' ? 'nav-item active' : 'nav-item'}>
                    <Activity size={20} className="nav-icon" />
                    <span>Academic Behaviour</span>
                </Link>

                <Link href="/student/dashboard/concerns" className={pathname === '/student/dashboard/concerns' ? 'nav-item active' : 'nav-item'}>
                    <MessageSquare size={20} className="nav-icon" />
                    <span>Personal Concerns</span>
                </Link>

                <div className="sidebar-divider"></div>

                <Link href="/student/dashboard/attendance" className={pathname === '/student/dashboard/attendance' ? 'nav-item active' : 'nav-item'}>
                    <CheckSquare size={20} className="nav-icon" />
                    <span>Attendance</span>
                </Link>

                <Link href="/student/dashboard/documents" className={pathname === '/student/dashboard/documents' ? 'nav-item active' : 'nav-item'}>
                    <FolderOpen size={20} className="nav-icon" />
                    <span>Documents</span>
                </Link>

                <Link href="/student/dashboard/goals" className={pathname === '/student/dashboard/goals' ? 'nav-item active' : 'nav-item'}>
                    <Target size={20} className="nav-icon" />
                    <span>Student Goals</span>
                </Link>

                <Link href="/student/dashboard/feedback" className={pathname === '/student/dashboard/feedback' ? 'nav-item active' : 'nav-item'}>
                    <Star size={20} className="nav-icon" />
                    <span>Feedback</span>
                </Link>

                <Link href="/student/dashboard/timeline" className={pathname === '/student/dashboard/timeline' ? 'nav-item active' : 'nav-item'}>
                    <Clock size={20} className="nav-icon" />
                    <span>Activity Timeline</span>
                </Link>

            </nav>
        </div>
    );
};

export default Sidebar;
