"use client";
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketProvider';
import { useRouter } from 'next/navigation';
import { RefreshCw, User, Shield, Bell, CheckCircle2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function DashboardHeader() {
    const { user, selectedRole, setSelectedRole } = useAuth();
    const { notifications } = useSocket();
    const router = useRouter();
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    const isClassIncharge = user.role === 'class_incharge';

    const toggleRole = () => {
        const nextRole = selectedRole === 'faculty' ? 'incharge' : 'faculty';
        setSelectedRole(nextRole);
        router.push(nextRole === 'faculty' ? '/dashboard/faculty' : '/dashboard/incharge');
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
                {/* Mode Indicator */}
                {isClassIncharge && (
                    <div className={`px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border transition-all duration-300 shadow-sm ${selectedRole === 'incharge'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                            : 'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>
                        <Shield size={12} strokeWidth={3} />
                        {selectedRole === 'incharge' ? 'Incharge Mode' : 'Faculty Mode'}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-6">
                {/* Real-time Notifications Bell */}
                <div className="relative" ref={dropdownRef}>
                    <div 
                        className="cursor-pointer text-gray-400 hover:text-blue-600 transition-colors p-1"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </div>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 backdrop-blur-md">
                                <h3 className="font-bold text-gray-800 text-sm">Notifications</h3>
                                <button className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Mark all read
                                </button>
                            </div>
                            <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                {notifications && notifications.length > 0 ? (
                                    notifications.map((notif: any, i: number) => (
                                        <div key={i} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.isRead ? 'bg-blue-50/20' : ''}`}>
                                            <p className="text-sm font-bold text-gray-800">{notif.title}</p>
                                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{notif.message}</p>
                                            <span className="text-[10px] text-gray-400 mt-2 block font-medium uppercase tracking-widest">{notif.type || 'System'} • Just now</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <Bell size={28} className="mx-auto mb-3 text-gray-300" strokeWidth={1.5} />
                                        <p className="text-sm font-medium">No new notifications</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Switch Role Toggle */}
                {isClassIncharge && (
                    <button
                        onClick={toggleRole}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 group"
                    >
                        <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Switch Role</span>
                    </button>
                )}

                {/* Profile Peek */}
                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-gray-900 leading-none">{user.name || 'Prof. John Doe'}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-1">{user.role.replace('_', ' ')}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <User size={18} />
                    </div>
                </div>
            </div>
        </header>
    );
}
