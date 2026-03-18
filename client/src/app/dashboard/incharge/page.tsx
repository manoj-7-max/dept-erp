"use client";
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
    Users, CalendarCheck, FileSpreadsheet, MessageSquare, 
    BarChart, CheckCircle2, AlertTriangle, TrendingUp,
    Download, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

export default function InchargeDashboard() {
    const { setSelectedRole } = useAuth();

    useEffect(() => {
        setSelectedRole('incharge');
    }, [setSelectedRole]);

    // Mock data for Incharge
    const summaryCards = [
        { label: 'Class Strength', value: 60, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Today Attendance', value: '92%', icon: CalendarCheck, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Avg. CGPA', value: '8.4', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Pending Feedback', value: 12, icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Class Incharge Dashboard</h1>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Class Monitoring & Administration</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition font-black uppercase text-xs tracking-widest">
                    <Download size={16} />
                    Download Class Registry
                </button>
            </div>

            {/* 1. Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {summaryCards.map((card, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 transition hover:shadow-md">
                        <div className={`p-4 rounded-xl ${card.bg} ${card.color}`}>
                            <card.icon size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{card.label}</p>
                            <h3 className="text-2xl font-black text-gray-900">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* 2. Attendance Status */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
                        <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                            <CalendarCheck className="text-green-600" />
                            Attendance Snapshot
                        </h2>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Year 2025-26</span>
                    </div>

                    <div className="space-y-6">
                        {[
                            { label: 'Students with > 75%', value: 52, trend: 'up', color: 'text-green-600', barColor: 'bg-green-500' },
                            { label: 'Students with 65-75%', value: 5, trend: 'down', color: 'text-orange-600', barColor: 'bg-orange-400' },
                            { label: 'Critical Lack of Attendance', value: 3, trend: 'up', color: 'text-red-600', barColor: 'bg-red-500' },
                        ].map((stat, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <p className="text-sm font-bold text-gray-600">{stat.label}</p>
                                    <div className="text-right">
                                        <span className={`text-lg font-black ${stat.color} block leading-none`}>{stat.value} Students</span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                                    <div className={`${stat.barColor} h-full rounded-full transition-all duration-1000`} style={{ width: `${(stat.value / 60) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Performance Summary */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
                        <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                            <TrendingUp className="text-blue-600" />
                            Academic Progress
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col items-center text-center">
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-3">Overall Pass %</p>
                            <div className="relative w-24 h-24 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-blue-100" />
                                    <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={264} strokeDashoffset={264 - (264 * 88) / 100} className="text-blue-600" />
                                </svg>
                                <span className="absolute text-xl font-black text-blue-900">88%</span>
                            </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-100 flex flex-col items-center text-center">
                            <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] mb-3">Participation</p>
                            <div className="relative w-24 h-24 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-purple-100" />
                                    <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={264} strokeDashoffset={264 - (264 * 72) / 100} className="text-purple-600" />
                                </svg>
                                <span className="absolute text-xl font-black text-purple-900">72%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Access Grid */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
                {[
                    { label: 'Attendance', icon: CalendarCheck, color: 'text-green-600' },
                    { label: 'CIA Marks', icon: FileSpreadsheet, color: 'text-blue-600' },
                    { label: 'Feedback', icon: MessageSquare, color: 'text-orange-600' },
                    { label: 'Records', icon: BarChart, color: 'text-purple-600' },
                ].map((action, i) => (
                    <button key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col items-center justify-center gap-2 group">
                        <div className={`p-2 rounded-lg bg-gray-50 group-hover:bg-white transition ${action.color}`}>
                            <action.icon size={20} />
                        </div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{action.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
