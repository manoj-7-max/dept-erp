"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    Users, Calendar, GraduationCap, BarChart2, AlertCircle,
    FileText, Search, ChevronLeft, Bell, Download, Mail,
    BookOpen, Clock, Activity, FileWarning, ArrowUpRight, ArrowDownRight, MapPin
} from 'lucide-react';

export default function ClassDetailDashboard() {
    const params = useParams();
    const classId = (params?.classId as string) || '2A';

    // Parse year and section from classId (e.g., '2A', '3B')
    const yearNumber = parseInt(classId.charAt(0)) || 2;
    const yearString = yearNumber === 2 ? '2nd' : yearNumber === 3 ? '3rd' : '4th';
    const section = classId.charAt(1) || 'A';

    const [searchQuery, setSearchQuery] = useState('');

    // --- Mock Data ---
    const headerInfo = [
        { label: 'Class', value: `${yearString} Year - Sec ${section}`, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Department', value: 'CSE', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Academic Year', value: '2025–2026', icon: Calendar, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Class Advisor', value: 'Dr. Subramani V', icon: GraduationCap, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Total Students', value: '60', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    const attendanceStats = [
        { label: 'Avg. Attendance', value: '88%', sub: 'Class average', trend: 'up', icon: Activity },
        { label: 'Students > 75%', value: '52', sub: 'Safe zone', trend: 'up', icon: ArrowUpRight },
        { label: 'Students < 75%', value: '8', sub: 'Action required', trend: 'down', icon: ArrowDownRight },
        { label: 'Present Today', value: '55 / 60', sub: '91.6% presence', trend: 'up', icon: Users },
    ];

    const studentList = [
        { roll: `CSE${yearNumber}${section}001`, name: 'Aarav Patel', att: 92, abs: 4, status: 'Good' },
        { roll: `CSE${yearNumber}${section}002`, name: 'Diya Sharma', att: 78, abs: 12, status: 'Good' },
        { roll: `CSE${yearNumber}${section}003`, name: 'Karthik Raja', att: 62, abs: 28, status: 'Critical' },
        { roll: `CSE${yearNumber}${section}004`, name: 'Priya Devi', att: 72, abs: 18, status: 'Warning' },
        { roll: `CSE${yearNumber}${section}005`, name: 'Rahul Verma', att: 98, abs: 1, status: 'Good' },
        { roll: `CSE${yearNumber}${section}006`, name: 'Sneha Gupta', att: 85, abs: 8, status: 'Good' },
    ].filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.roll.toLowerCase().includes(searchQuery.toLowerCase()));

    const subjectAttendance = [
        { sub: 'Data Structures', faculty: 'Prof. Anitha', classes: 45, att: 88, status: 'On Track' },
        { sub: 'Operating Systems', faculty: 'Prof. Karthik', classes: 42, att: 82, status: 'On Track' },
        { sub: 'Computer Networks', faculty: 'Dr. Ramesh', classes: 40, att: 71, status: 'Warning' },
    ];

    const ciaPerformance = [
        { name: 'Aarav Patel', cia1: 85, cia2: 88, cia3: 92, avg: 88.3, status: 'Excellent' },
        { name: 'Diya Sharma', cia1: 75, cia2: 78, cia3: 80, avg: 77.6, status: 'Average' },
        { name: 'Karthik Raja', cia1: 45, cia2: 52, cia3: 60, avg: 52.3, status: 'Needs Improvement' },
        { name: 'Priya Devi', cia1: 65, cia2: 70, cia3: 68, avg: 67.6, status: 'Average' },
    ];

    const teachingProgress = [
        { sub: 'Data Structures', faculty: 'Prof. Anitha', syllabus: 75, status: 'On Schedule' },
        { sub: 'Operating Systems', faculty: 'Prof. Karthik', syllabus: 60, status: 'Behind Schedule' },
        { sub: 'Computer Networks', faculty: 'Dr. Ramesh', syllabus: 80, status: 'On Schedule' },
    ];

    return (
        <div className="p-8 bg-gray-50 min-h-screen text-gray-800 font-sans">
            {/* Header & Breadcrumbs */}
            <div className="mb-8">
                <Link href="/dashboard/hod/students" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-bold mb-4 transition">
                    <ChevronLeft size={16} /> Back to Class Monitoring
                </Link>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Class Detail Dashboard</h1>
                        <p className="text-gray-500 mt-1 font-medium text-sm">Comprehensive Academic & Attendance Analytics</p>
                    </div>
                </div>
            </div>

            {/* Page Header Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                {headerInfo.map((info, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${info.bg} ${info.color}`}>
                            <info.icon size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{info.label}</p>
                            <p className="font-bold text-gray-900 text-sm">{info.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Layout Grid: 3 Columns Total (Content 2 / Sidebar 1) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ---------- MAIN CONTENT AREA (Left 2 Columns) ---------- */}
                <div className="lg:col-span-2 flex flex-col gap-8">

                    {/* Attendance Analytics Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                            <Activity size={20} className="text-blue-600" />
                            <h2 className="text-lg font-extrabold text-gray-900">Attendance Analytics</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {attendanceStats.map((stat, i) => (
                                <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-2">
                                        <stat.icon size={18} className="text-gray-400" />
                                        {stat.trend === 'up' ? <ArrowUpRight size={16} className="text-green-500" /> : <ArrowDownRight size={16} className="text-red-500" />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900">{stat.value}</h3>
                                        <p className="text-xs font-bold text-gray-800 mt-1">{stat.label}</p>
                                        <p className="text-[10px] font-semibold text-gray-400">{stat.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chart Placeholder (CSS Visual) */}
                        <div className="mt-8 flex items-end h-32 gap-3 px-4">
                            {[65, 80, 75, 92, 88, 70, 85, 95, 82, 90].map((val, i) => (
                                <div key={i} className="flex-1 flex flex-col justify-end items-center group relative gap-2">
                                    <div className="absolute -top-8 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">{val}%</div>
                                    <div className={`w-full rounded-t-lg transition-all ${val < 75 ? 'bg-orange-400' : 'bg-blue-600'}`} style={{ height: `${val}%` }}></div>
                                    <div className="text-[10px] font-bold text-gray-400">Day {i + 1}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Student Attendance Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
                            <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                                <Users size={20} className="text-blue-600" /> Detailed Student Attendance
                            </h2>
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search student..."
                                    className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition w-full md:w-64"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="p-4 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Roll & Name</th>
                                        <th className="p-4 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center">Attendance %</th>
                                        <th className="p-4 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center">Absences</th>
                                        <th className="p-4 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {studentList.map((s, i) => (
                                        <tr key={i} className="hover:bg-gray-50/50 transition">
                                            <td className="p-4 px-6">
                                                <div className="font-bold text-gray-900 text-sm">{s.name}</div>
                                                <div className="text-xs font-mono text-gray-400 mt-0.5">{s.roll}</div>
                                            </td>
                                            <td className="p-4 px-6">
                                                <div className="flex items-center justify-center gap-3">
                                                    <span className={`text-sm font-black ${s.att < 65 ? 'text-red-600' : s.att < 75 ? 'text-orange-500' : 'text-green-600'}`}>{s.att}%</span>
                                                </div>
                                            </td>
                                            <td className="p-4 px-6 text-center">
                                                <span className="text-sm font-bold text-gray-700">{s.abs} days</span>
                                            </td>
                                            <td className="p-4 px-6 text-right">
                                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest border ${s.status === 'Good' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        s.status === 'Warning' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                            'bg-red-50 text-red-700 border-red-200'
                                                    }`}>
                                                    {s.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Faculty Teaching Progress */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-white">
                            <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                                <BookOpen size={20} className="text-blue-600" /> Faculty Teaching Progress
                            </h2>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Subject & Faculty</th>
                                    <th className="p-4 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest w-1/3 text-center">Syllabus Completion</th>
                                    <th className="p-4 px-6 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {teachingProgress.map((tp, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition">
                                        <td className="p-4 px-6">
                                            <div className="font-bold text-gray-900 text-sm">{tp.sub}</div>
                                            <div className="text-xs font-semibold text-gray-500 mt-0.5">{tp.faculty}</div>
                                        </td>
                                        <td className="p-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${tp.syllabus < 65 ? 'bg-orange-500' : 'bg-blue-600'}`} style={{ width: `${tp.syllabus}%` }}></div>
                                                </div>
                                                <span className="text-xs font-bold text-gray-700">{tp.syllabus}%</span>
                                            </div>
                                        </td>
                                        <td className="p-4 px-6 text-right">
                                            <span className={`text-[10px] font-extrabold tracking-widest uppercase ${tp.status === 'On Schedule' ? 'text-green-600' : 'text-orange-600'}`}>
                                                {tp.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Subject-wise Attendance & Internal Assessment performance */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* CIA Performance Table */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                            <div className="p-5 border-b border-gray-100 bg-white">
                                <h2 className="text-md font-extrabold text-gray-900 flex items-center gap-2">
                                    <FileText size={18} className="text-purple-600" /> CIA Performance Map
                                </h2>
                            </div>
                            <div className="overflow-x-auto flex-1 p-2">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr>
                                            <th className="p-3 text-[10px] font-extrabold text-gray-400 uppercase">Student</th>
                                            <th className="p-3 text-[10px] font-extrabold text-gray-400 uppercase text-center">Avg</th>
                                            <th className="p-3 text-[10px] font-extrabold text-gray-400 uppercase text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {ciaPerformance.map((cia, i) => (
                                            <tr key={i}>
                                                <td className="p-3 font-bold text-gray-800 text-xs">{cia.name}</td>
                                                <td className="p-3 text-center font-bold text-gray-600 text-xs">{cia.avg}</td>
                                                <td className="p-3 text-right">
                                                    <span className={`text-[10px] font-extrabold uppercase ${cia.status === 'Excellent' ? 'text-green-600' :
                                                            cia.status === 'Average' ? 'text-blue-600' : 'text-orange-600'
                                                        }`}>{cia.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Subject Attendance Table */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                            <div className="p-5 border-b border-gray-100 bg-white">
                                <h2 className="text-md font-extrabold text-gray-900 flex items-center gap-2">
                                    <Calendar size={18} className="text-green-600" /> Subj. Attendance Base
                                </h2>
                            </div>
                            <div className="overflow-x-auto flex-1 p-2">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr>
                                            <th className="p-3 text-[10px] font-extrabold text-gray-400 uppercase">Subject</th>
                                            <th className="p-3 text-[10px] font-extrabold text-gray-400 uppercase text-center">% Atnd</th>
                                            <th className="p-3 text-[10px] font-extrabold text-gray-400 uppercase text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {subjectAttendance.map((sa, i) => (
                                            <tr key={i}>
                                                <td className="p-3 font-bold text-gray-800 text-xs truncate max-w-[100px]">{sa.sub}</td>
                                                <td className="p-3 text-center">
                                                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-1">
                                                        <div className={`h-full ${sa.att < 75 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${sa.att}%` }}></div>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-500">{sa.att}%</span>
                                                </td>
                                                <td className="p-3 text-right">
                                                    <span className={`text-[10px] font-extrabold uppercase ${sa.status === 'On Track' ? 'text-green-600' : 'text-orange-600'}`}>{sa.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>


                {/* ---------- RIGHT SIDEBAR AREA (1 Column) ---------- */}
                <div className="flex flex-col gap-8">

                    {/* Current Class Activity (Highlighted) */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-lg p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <Clock size={80} strokeWidth={1} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-blue-100 font-bold text-xs uppercase tracking-widest mb-4">
                                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                                Live Now · Period 3
                            </div>
                            <h3 className="text-2xl font-black mb-1">Operating Systems</h3>
                            <p className="text-blue-100 font-medium text-sm mb-6">Prof. Karthik</p>

                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1">Current Topic</p>
                                <p className="font-bold text-sm mb-4">Deadlock Avoidance & Bankers Algo</p>

                                <div className="flex items-center gap-3">
                                    <Users size={16} className="text-blue-200" />
                                    <span className="font-bold text-sm">52 / 60 <span className="text-blue-200 font-medium">Students Present</span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Student Alerts Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
                            <h3 className="font-extrabold text-gray-900 flex items-center gap-2">
                                <AlertCircle size={18} className="text-red-500" /> Action Alerts
                            </h3>
                            <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-extrabold px-2 py-0.5 rounded-lg">3</span>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-4 items-start p-3 bg-red-50 border border-red-100 rounded-xl">
                                <FileWarning size={16} className="text-red-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-red-900 mb-1">8 Students below 75% Attendance</p>
                                    <p className="text-[10px] font-semibold text-red-700">Immediate warning notification required before end of month.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start p-3 bg-orange-50 border border-orange-100 rounded-xl">
                                <BarChart2 size={16} className="text-orange-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-orange-900 mb-1">High failure rate - CIA 1</p>
                                    <p className="text-[10px] font-semibold text-orange-700">12 students scored below passing threshold in OS.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start p-3 bg-yellow-50 border border-yellow-100 rounded-xl">
                                <Clock size={16} className="text-yellow-600 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-yellow-900 mb-1">Repeated Absences - Karthik Raja</p>
                                    <p className="text-[10px] font-semibold text-yellow-700">Absent for 5 consecutive days without Medical leave.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reports & Actions */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="mb-6 border-b border-gray-50 pb-4">
                            <h3 className="font-extrabold text-gray-900 flex items-center gap-2">
                                <MapPin size={18} className="text-gray-400" /> Quick Actions
                            </h3>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button className="flex justify-between items-center w-full p-3 bg-gray-50 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-xl transition text-xs font-bold shadow-sm">
                                <span className="flex items-center gap-2"><Download size={14} /> Class Report PDF</span>
                                <ChevronLeft size={14} className="rotate-180 text-gray-400" />
                            </button>
                            <button className="flex justify-between items-center w-full p-3 bg-gray-50 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-xl transition text-xs font-bold shadow-sm">
                                <span className="flex items-center gap-2"><FileText size={14} /> Full Attendance Log</span>
                                <ChevronLeft size={14} className="rotate-180 text-gray-400" />
                            </button>
                            <button className="flex justify-between items-center w-full p-3 bg-gray-50 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-xl transition text-xs font-bold shadow-sm">
                                <span className="flex items-center gap-2"><BarChart2 size={14} /> CIA Marks Report</span>
                                <ChevronLeft size={14} className="rotate-180 text-gray-400" />
                            </button>
                            <button className="flex justify-between items-center w-full p-3 bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 rounded-xl transition text-xs font-bold shadow-sm mt-2">
                                <span className="flex items-center gap-2"><Mail size={14} /> Send Warnings</span>
                                <ChevronLeft size={14} className="rotate-180 text-red-400" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
