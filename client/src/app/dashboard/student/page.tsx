"use client";
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, Clock, BookOpen, Bell } from 'lucide-react';

export default function StudentDashboard() {
    const { user } = useAuth();

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                        Welcome back, <span className="text-emerald-600">{user?.name || 'Student'}</span>! 👋
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Student Dashboard (Coming Soon)
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                        <GraduationCap size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Enrollment No</p>
                        <p className="text-sm font-bold text-emerald-900">2021CSE042</p>
                    </div>
                </div>
            </div>

            {/* Placeholder Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { title: 'My Attendance', icon: Clock, color: 'blue' },
                    { title: 'Study Materials', icon: BookOpen, color: 'purple' },
                    { title: 'Notice Board', icon: Bell, color: 'orange' }
                ].map((item, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm opacity-60 grayscale-[0.5] relative overflow-hidden group">
                        <div className={`p-4 bg-${item.color}-50 text-${item.color}-600 rounded-2xl w-fit mb-6`}>
                            <item.icon size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-500 text-sm font-medium italic">Available in next update</p>
                        
                        <div className="absolute top-4 right-4 bg-gray-100 text-gray-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                            Locked
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State Illustration Placeholder */}
            <div className="flex flex-col items-center justify-center py-20 bg-emerald-50/30 rounded-[3rem] border-2 border-dashed border-emerald-100/50">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-6">
                    <GraduationCap size={40} className="text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Building Your Portal</h2>
                <p className="text-gray-500 font-medium max-w-sm text-center">
                    We're currently working on the student portal feature. You'll soon be able to track your progress, access resources, and more.
                </p>
            </div>
        </div>
    );
}
