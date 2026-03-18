"use client";
import React from 'react';
import { Bell, Calendar, Eye, FileText, Search, Clock } from 'lucide-react';

export default function Circulars() {
    const circulars = [
        { id: 1, title: 'End Semester Internal-2 Exam Schedule', date: '2024-03-20', category: 'Exam', priority: 'High', content: 'Detailed schedule for Internal-2 exams for all years...' },
        { id: 2, title: 'Department Faculty Meeting - NAAC Prep', date: '2024-03-18', category: 'Meeting', priority: 'Medium', content: 'All faculty members are requested to attend the meeting regarding NAAC documentation...' },
        { id: 3, title: 'Symposium Student Coordinators Meeting', date: '2024-03-15', category: 'Events', priority: 'Normal', content: 'Meeting with student coordinators for the upcoming Technical Symposium...' },
    ];

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Department Circulars</h1>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Official announcements and notifications from the department</p>
                </div>
                <div className="relative group">
                    <input type="text" placeholder="Search announcements..." className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-xs w-64 bg-white shadow-sm transition" />
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {circulars.map((circ) => (
                    <div key={circ.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                    circ.priority === 'High' ? 'bg-red-50 text-red-500' :
                                    circ.priority === 'Medium' ? 'bg-orange-50 text-orange-500' :
                                    'bg-blue-50 text-blue-500'
                                }`}>
                                    <Bell size={24} className={circ.priority === 'High' ? 'animate-bounce' : ''} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 leading-tight">{circ.title}</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                                            circ.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {circ.priority} Priority
                                        </span>
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <Calendar size={12} /> {circ.date}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-500 group-hover:bg-blue-600 group-hover:text-white transition font-black text-xs uppercase tracking-widest">
                                <Eye size={14} />
                                View Details
                            </button>
                        </div>
                        <p className="text-sm font-medium text-gray-600 pl-16">
                            {circ.content}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
