"use client";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, BookOpen, FileText, Bell, Users, UsersRound,
    MessageSquare, BarChart, CalendarCheck, FileSpreadsheet,
    CheckSquare, User, LogOut, BookCopy, TrendingUp, LineChart, HeartHandshake
} from 'lucide-react';

export default function Sidebar() {
    const { user, logout, selectedRole } = useAuth();
    const pathname = usePathname();

    if (!user) return null;

    const facultyLinks = [
        { name: 'Overview', href: '/dashboard/faculty', icon: LayoutDashboard },
        { name: 'Profile', href: '/dashboard/faculty/profile', icon: User },
        { name: 'Academics', href: '/dashboard/faculty/academics', icon: BookOpen },
        { name: 'Daily Test', href: '/dashboard/faculty/daily-test', icon: CalendarCheck },
        { name: 'Internal Assessment', href: '/dashboard/faculty/internal-assessment', icon: FileSpreadsheet },
        { name: 'Research Papers', href: '/dashboard/faculty/research-papers', icon: BookCopy },
        { name: 'Mentor', href: '/dashboard/faculty/mentor', icon: HeartHandshake },
        { name: 'Circulars', href: '/dashboard/faculty/circulars', icon: Bell },
        { name: 'Complaint', href: '/dashboard/faculty/complaint', icon: MessageSquare },
        { name: 'Reports', href: '/dashboard/faculty/reports', icon: BarChart },
    ];

    const inchargeLinks = [
        { name: 'Dashboard', href: '/dashboard/incharge', icon: LayoutDashboard },
        { name: 'Class Attendance', href: '/dashboard/incharge/attendance', icon: CalendarCheck },
        { name: 'Daily Test Marks', href: '/dashboard/incharge/daily-test-marks', icon: CheckSquare },
        { name: 'Internal Marks-1', href: '/dashboard/incharge/internal-marks-1', icon: FileSpreadsheet },
        { name: 'Internal Marks-2', href: '/dashboard/incharge/internal-marks-2', icon: FileSpreadsheet },
        { name: 'Co-curricular', href: '/dashboard/incharge/co-curricular', icon: UsersRound },
        { name: 'Feedback', href: '/dashboard/incharge/feedback', icon: MessageSquare },
        { name: 'Reports', href: '/dashboard/incharge/reports', icon: BarChart },
    ];

    const links = {
        hod: [
            { name: 'Dashboard', href: '/dashboard/hod', icon: LayoutDashboard },
            { name: 'Academics', href: '/dashboard/academics', icon: BookOpen },
            { name: 'Requests', href: '/dashboard/hod/requests', icon: FileText },
            { name: 'Circulars', href: '/dashboard/hod/circulars', icon: Bell },
            { name: 'Faculty', href: '/dashboard/hod/faculty', icon: Users },
            { name: 'Students', href: '/dashboard/hod/students', icon: UsersRound },
            { name: 'Complaints', href: '/dashboard/hod/complaints', icon: MessageSquare },
            { name: 'Student Feedback', href: '/dashboard/hod/student-complaints', icon: MessageSquare },
            { name: 'Reports', href: '/dashboard/hod/reports', icon: BarChart },
            { name: 'Publications', href: '/dashboard/hod/publications', icon: BookCopy },
            { name: 'R&D Performance', href: '/dashboard/hod/performance', icon: TrendingUp },
            { name: 'Staff Performance', href: '/dashboard/hod/staff-performance', icon: LineChart },
        ],
        faculty: facultyLinks,
        class_incharge: selectedRole === 'incharge' ? inchargeLinks : facultyLinks,
        student: [
            { name: 'Dashboard', href: '/dashboard/student', icon: LayoutDashboard },
            { name: 'Academics', href: '/dashboard/academics', icon: BookOpen },
            { name: 'Notices', href: '/dashboard/student/circulars', icon: Bell },
            { name: 'My Attendance', href: '/dashboard/student/attendance', icon: CalendarCheck },
            { name: 'Apply Leave/OD', href: '/dashboard/student/apply', icon: FileText },
            { name: 'Complaints', href: '/dashboard/complaints', icon: MessageSquare },
            { name: 'Results', href: '/dashboard/student/results', icon: BarChart },
        ]
    };

    const roleLinks = links[user.role as keyof typeof links] || [];

    // Fallback names for mock users
    const displayName = user.name || (user.role === 'hod' ? 'Dr. Subramani V' : user.role === 'faculty' ? 'Prof. Anitha' : 'Student Name');
    const displayRole = user.role === 'hod' ? 'HOD' : user.role === 'class_incharge' ? (selectedRole === 'incharge' ? 'Class Incharge' : 'Faculty') : user.role === 'faculty' ? 'Faculty' : 'Student';
    const displayDept = user.department || 'CSE';

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 h-screen fixed top-0 left-0 flex flex-col z-50">
            {/* 1. Sidebar Header */}
            <div className="h-20 flex items-center px-6 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <BookOpen size={18} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-white tracking-wide">ERP System</h1>
                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">{displayDept} Department</p>
                    </div>
                </div>
            </div>

            {/* 2. Sidebar Navigation (Scrollable) */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
                {roleLinks.map((link) => {
                    const isActive = pathname === link.href || 
                                   (pathname.startsWith(`${link.href}/`) && 
                                    link.name !== 'Dashboard' && 
                                    link.name !== 'Overview');
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm group ${isActive
                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-1.5 before:bg-white before:rounded-r-full before:shadow-[0_0_10px_rgba(255,255,255,0.5)] overflow-hidden'
                                : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                                }`}
                        >
                            <link.icon
                                size={18}
                                strokeWidth={isActive ? 2.5 : 2}
                                className={`transition-colors relative z-10 ${isActive ? 'text-white drop-shadow-md' : 'text-slate-500 group-hover:text-blue-400'}`}
                            />
                            <span className="relative z-10 tracking-wide">{link.name}</span>

                            {/* Subtle hover effect background for inactive items */}
                            {!isActive && (
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-slate-800/0 to-slate-800/0 group-hover:from-slate-800/50 group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* 3. Sidebar Footer (Fixed at bottom) */}
            <div className="p-5 border-t border-slate-800 bg-slate-900/50 backdrop-blur shrink-0">
                {/* Profile Section */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md ring-2 ring-slate-800">
                        {displayName.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-200 truncate">{displayName}</p>
                        <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider truncate">{displayRole} - {displayDept}</p>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2.5 px-4 rounded-xl transition-all font-bold text-sm border border-red-500/20 hover:border-red-500/30 group"
                >
                    <LogOut size={16} strokeWidth={2.5} className="group-hover:-translate-x-0.5 transition-transform" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
