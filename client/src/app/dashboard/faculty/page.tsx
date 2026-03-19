"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    CheckSquare, Users, BookOpen, Clock, AlertTriangle,
    CalendarCheck, FileText, CheckCircle2, AlertCircle,
    Bell, BarChart2, UserCheck, UserMinus, PlusCircle, ArrowUpRight, ArrowDownRight, UploadCloud, Edit, BookCopy
} from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';

import { fetchFacultyStats } from '@/services/api';

export default function FacultyDashboard() {
    const { token, user, setSelectedRole } = useAuth();
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        if (user?.role === 'class_incharge') {
            setSelectedRole('faculty');
        }
        loadStats();
    }, [user, setSelectedRole]);

    const loadStats = async () => {
        try {
            const res = await fetchFacultyStats();
            setStats(res.data);
        } catch (err) {
            console.error('Error loading stats:', err);
        }
    };

    // 1. Top Summary Cards (Dynamic)
    const summaryCards = [
        { label: 'Subjects Handling', value: stats?.subjectCount || 4, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Lesson Plan Completion', value: stats?.lessonPlanCompletion || '75%', icon: CheckSquare, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Mentees Assigned', value: stats?.menteesCount || 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Pending Verifications', value: stats?.pendingRequests || 0, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Research Papers', value: stats?.researchPapers || 0, icon: BookCopy, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    // 2. Today's Schedule 
    const todaySchedule = [
        { time: '09:00 AM - 10:40 AM', subject: 'Data Structures', class: '2nd Year A', room: 'Room 204', status: 'Completed' },
        { time: '11:00 AM - 12:40 PM', subject: 'DBMS', class: '3rd Year B', room: 'Lab 3', status: 'In Progress' },
        { time: '02:00 PM - 03:40 PM', subject: 'Operating Systems', class: '3rd Year A', room: 'Room 101', status: 'Upcoming' },
    ];

    // 3. Attendance Overview
    const attendanceOverview = [
        { label: 'Avg. Class Attendance', value: '88%', trend: 'up', icon: BarChart2 },
        { label: 'Students > 75%', value: '205', trend: 'up', icon: ArrowUpRight },
        { label: 'Students < 75%', value: '35', trend: 'down', icon: ArrowDownRight },
    ];

    // 4. My Subjects Handled
    const mySubjects = [
        { subject: 'Data Structures', year: '2nd Year', section: 'A', students: 60, progress: 70 },
        { subject: 'DBMS', year: '3rd Year', section: 'B', students: 58, progress: 65 },
        { subject: 'Operating Systems', year: '3rd Year', section: 'A', students: 62, progress: 80 },
        { subject: 'Artificial Intelligence', year: '4th Year', section: 'C', students: 60, progress: 45 },
    ];

    // 5. Recent Activities
    const recentActivities = [
        'Attendance submitted for 2nd Year A (Data Structures)',
        'Internal marks uploaded for DBMS (CIA 1)',
        'Lesson plan updated for Operating Systems',
        'Complaint submitted regarding Projector in Room 204',
    ];

    // 6. Pending Tasks
    const pendingTasks = [
        { task: 'Upload CIA 2 marks for DBMS', due: 'Tomorrow', type: 'critical' },
        { task: 'Submit Lesson Plan for upcoming week', due: 'In 2 days', type: 'warning' },
        { task: 'Verify OD request for Karthik (3rd Year B)', due: 'Today', type: 'info' },
    ];

    return (
        <AnimatedPage>
        <div className="p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight page-title-underline">Faculty Dashboard</h1>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Academic Overview & Daily Operations</p>
                </div>
            </div>

            {/* 1. Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-8 reveal-section">
                {summaryCards.map((card, i) => (
                    <div key={i} className="stat-card bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center card-hover card-glow reveal">
                        <div className={`stat-icon p-3 rounded-xl ${card.bg} ${card.color} mb-3 icon-hover-bounce`}>
                            <card.icon size={20} strokeWidth={2.5} />
                        </div>
                        <p className="stat-value text-2xl font-black text-gray-900">{card.value}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 leading-tight">{card.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                {/* 2. Today's Schedule */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center gap-2 bg-white">
                        <CalendarCheck size={18} className="text-blue-600" />
                        <h2 className="text-lg font-extrabold text-gray-900">Today's Schedule</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table-modern w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Time</th>
                                    <th className="p-4 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Subject</th>
                                    <th className="p-4 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Year / Sec</th>
                                    <th className="p-4 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Room</th>
                                    <th className="p-4 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {todaySchedule.map((cls, i) => (
                                    <tr key={i} className="">
                                        <td className="p-4 px-6 text-sm font-bold text-gray-700 whitespace-nowrap">{cls.time}</td>
                                        <td className="p-4 px-6 font-bold text-gray-900 text-sm">{cls.subject}</td>
                                        <td className="p-4 px-6 text-sm font-semibold text-gray-600">{cls.class}</td>
                                        <td className="p-4 px-6 text-sm font-semibold text-gray-600">{cls.room}</td>
                                        <td className="p-4 px-6 text-right w-32">
                                            <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-lg border ${cls.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                cls.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse' :
                                                    'bg-gray-100 text-gray-600 border-gray-200'
                                                }`}>
                                                {cls.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3. Student Attendance Overview */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                            <BarChart2 size={18} className="text-purple-600" />
                            <h2 className="text-lg font-extrabold text-gray-900">Attendance Overview</h2>
                        </div>

                        <div className="flex flex-col gap-4 mb-8">
                            {attendanceOverview.map((stat, i) => (
                                <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                        <h3 className="text-xl font-black text-gray-900">{stat.value}</h3>
                                    </div>
                                    <div className={`p-2 rounded-lg ${stat.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        <stat.icon size={16} strokeWidth={3} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Visual Bar Chart Progress */}
                    <div className="w-full bg-gray-100 rounded-full h-3 flex overflow-hidden">
                        <div className="bg-green-500 h-full text-[8px] flex items-center justify-center text-white font-bold" style={{ width: '75%' }}></div>
                        <div className="bg-orange-400 h-full" style={{ width: '15%' }}></div>
                        <div className="bg-red-500 h-full" style={{ width: '10%' }}></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase mt-2">
                        <span>&gt;75% (Safe)</span>
                        <span>&lt;75% (Critical)</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                {/* 4. My Subjects Section */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center gap-2 bg-white">
                        <BookOpen size={18} className="text-indigo-600" />
                        <h2 className="text-lg font-extrabold text-gray-900">My Subjects</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table-modern w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Subject</th>
                                    <th className="p-4 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center">Class</th>
                                    <th className="p-4 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center">Students</th>
                                    <th className="p-4 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center w-48">Syllabus Progress</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {mySubjects.map((sub, i) => (
                                    <tr key={i} className="">
                                        <td className="p-4 px-6 font-bold text-gray-900 text-sm">{sub.subject}</td>
                                        <td className="p-4 px-6 text-center text-sm font-semibold text-gray-600">{sub.year} - {sub.section}</td>
                                        <td className="p-4 px-6 text-center text-sm font-bold text-gray-700">{sub.students}</td>
                                        <td className="p-4 px-6">
                                            <div className="flex items-center gap-3 justify-center">
                                                <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full progress-animated ${sub.progress >= 70 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${sub.progress}%` }}></div>
                                                </div>
                                                <span className="text-xs font-bold text-gray-800 w-8">{sub.progress}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 6. Pending Tasks Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                        <CheckSquare size={18} className="text-orange-600" />
                        <h2 className="text-lg font-extrabold text-gray-900">Pending Tasks</h2>
                    </div>
                    <div className="flex flex-col gap-3">
                        {pendingTasks.map((task, i) => (
                            <div key={i} className={`p-4 rounded-xl border flex gap-3 items-start transition hover:shadow-sm ${task.type === 'critical' ? 'bg-red-50 border-red-100' :
                                task.type === 'warning' ? 'bg-orange-50 border-orange-100' :
                                    'bg-blue-50 border-blue-100'
                                }`}>
                                <div className={`pt-0.5 ${task.type === 'critical' ? 'text-red-500' :
                                    task.type === 'warning' ? 'text-orange-500' : 'text-blue-500'
                                    }`}>
                                    <AlertCircle size={16} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className={`text-sm font-bold mb-1 ${task.type === 'critical' ? 'text-red-900' :
                                        task.type === 'warning' ? 'text-orange-900' : 'text-blue-900'
                                        }`}>{task.task}</p>
                                    <p className={`text-[10px] font-extrabold uppercase tracking-wide ${task.type === 'critical' ? 'text-red-600' :
                                        task.type === 'warning' ? 'text-orange-600' : 'text-blue-600'
                                        }`}>Due: {task.due}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* 7. Quick Actions Panel */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                        <PlusCircle size={18} className="text-teal-600" />
                        <h2 className="text-lg font-extrabold text-gray-900">Quick Actions</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4 flex-1">
                        <button className="btn-animate flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 text-gray-700 rounded-xl shadow-sm group">
                            <CalendarCheck size={28} className="mb-2 text-gray-400 group-hover:text-blue-600 transition icon-hover-bounce" />
                            <span className="text-xs font-bold">Mark Attendance</span>
                        </button>
                        <button className="btn-animate flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 text-gray-700 rounded-xl shadow-sm group">
                            <UploadCloud size={28} className="mb-2 text-gray-400 group-hover:text-blue-600 transition icon-hover-bounce" />
                            <span className="text-xs font-bold">Upload Internal Marks</span>
                        </button>
                        <button className="btn-animate flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 text-gray-700 rounded-xl shadow-sm group">
                            <Edit size={28} className="mb-2 text-gray-400 group-hover:text-blue-600 transition icon-hover-bounce" />
                            <span className="text-xs font-bold">Update Syllabus</span>
                        </button>
                        <button className="btn-animate flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 text-gray-700 rounded-xl shadow-sm group">
                            <FileText size={28} className="mb-2 text-gray-400 group-hover:text-blue-600 transition icon-hover-bounce" />
                            <span className="text-xs font-bold">Upload Notes</span>
                        </button>
                    </div>
                </div>

                {/* 5. Recent Activities Panel */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                        <Bell size={18} className="text-gray-400" />
                        <h2 className="text-lg font-extrabold text-gray-900">Recent Activities</h2>
                    </div>
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-200 before:to-transparent">
                        {recentActivities.map((text, i) => (
                            <div key={i} className="relative flex items-center gap-4">
                                <div className="w-6 h-6 rounded-full border-4 border-white bg-blue-500 shadow-sm shrink-0 z-10 flex items-center justify-center">
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex-1 text-sm font-medium text-gray-700 shadow-sm">
                                    {text}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        </AnimatedPage>
    );
}
