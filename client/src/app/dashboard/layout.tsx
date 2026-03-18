"use client";
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import ERPAssistant from '@/components/ERPAssistant';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/');
                return;
            }

            // Role-based access control
            const role = user.role;
            if (pathname.startsWith('/dashboard/hod') && role !== 'hod') {
                router.push('/dashboard/' + (role === 'class_incharge' ? 'faculty' : role));
            } else if (pathname.startsWith('/dashboard/faculty') && role !== 'faculty' && role !== 'class_incharge') {
                router.push('/dashboard/' + role);
            } else if (pathname.startsWith('/dashboard/incharge') && role !== 'class_incharge') {
                router.push('/dashboard/' + role);
            } else if (pathname.startsWith('/dashboard/student') && role !== 'student') {
                router.push('/dashboard/' + (role === 'class_incharge' ? 'faculty' : role));
            }
        }
    }, [user, loading, router, pathname]);

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col h-screen">
                <DashboardHeader />
                <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
                    {children}
                </main>
                <ERPAssistant />
            </div>
        </div>
    );
}
