"use client";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { RefreshCw, User, Shield } from 'lucide-react';

export default function DashboardHeader() {
    const { user, selectedRole, setSelectedRole } = useAuth();
    const router = useRouter();

    if (!user) return null;

    const isClassIncharge = user.role === 'class_incharge';

    const toggleRole = () => {
        const nextRole = selectedRole === 'faculty' ? 'incharge' : 'faculty';
        setSelectedRole(nextRole);
        router.push(nextRole === 'faculty' ? '/dashboard/faculty' : '/dashboard/incharge');
    };

    return (
        <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
                {/* Mode Indicator */}
                {isClassIncharge && (
                    <div className={`px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border transition-all duration-300 shadow-sm ${
                        selectedRole === 'incharge' 
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-100' 
                        : 'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                        <Shield size={12} strokeWidth={3} />
                        {selectedRole === 'incharge' ? 'Incharge Mode' : 'Faculty Mode'}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-6">
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
