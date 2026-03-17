"use client";
import { useRouter } from 'next/navigation';
import { HeartHandshake, ChevronRight, Calendar, CheckCircle, AlertCircle, Clock, UserCircle } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';

export interface MenteeStudent {
    id: string;
    name: string;
    registerNumber: string;
    department: string;
    year: string;
    section: string;
    lastMeetingDate: string;
    status: 'On Track' | 'Needs Attention' | 'At Risk';
    avatar: string;
    attendance: number;
    cgpa: string;
}

export const menteeStudents: MenteeStudent[] = [
    {
        id: 'S001',
        name: 'Arun Kumar S',
        registerNumber: '822221101001',
        department: 'CSE',
        year: '3rd Year',
        section: 'A',
        lastMeetingDate: '2026-03-01',
        status: 'On Track',
        avatar: 'A',
        attendance: 88,
        cgpa: '8.4',
    },
    {
        id: 'S002',
        name: 'Priya Devi R',
        registerNumber: '822221101002',
        department: 'CSE',
        year: '3rd Year',
        section: 'A',
        lastMeetingDate: '2026-02-22',
        status: 'Needs Attention',
        avatar: 'P',
        attendance: 71,
        cgpa: '6.9',
    },
    {
        id: 'S003',
        name: 'Karthik Raja M',
        registerNumber: '822221101003',
        department: 'CSE',
        year: '3rd Year',
        section: 'A',
        lastMeetingDate: '2026-03-05',
        status: 'On Track',
        avatar: 'K',
        attendance: 92,
        cgpa: '9.1',
    },
    {
        id: 'S004',
        name: 'Sridevi N',
        registerNumber: '822221101004',
        department: 'CSE',
        year: '3rd Year',
        section: 'A',
        lastMeetingDate: '2026-01-18',
        status: 'At Risk',
        avatar: 'S',
        attendance: 62,
        cgpa: '5.8',
    },
    {
        id: 'S005',
        name: 'Mahesh K',
        registerNumber: '822221101005',
        department: 'CSE',
        year: '3rd Year',
        section: 'A',
        lastMeetingDate: '2026-02-28',
        status: 'On Track',
        avatar: 'M',
        attendance: 85,
        cgpa: '7.7',
    },
    {
        id: 'S006',
        name: 'Anitha Lakshmi V',
        registerNumber: '822221101006',
        department: 'CSE',
        year: '3rd Year',
        section: 'A',
        lastMeetingDate: '2026-02-10',
        status: 'Needs Attention',
        avatar: 'A',
        attendance: 74,
        cgpa: '6.5',
    },
];

const statusConfig = {
    'On Track': {
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        dot: 'bg-green-500',
    },
    'Needs Attention': {
        icon: Clock,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
    },
    'At Risk': {
        icon: AlertCircle,
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
        dot: 'bg-red-500',
    },
};

const avatarColors = [
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-500',
    'from-teal-500 to-cyan-600',
    'from-orange-500 to-red-500',
    'from-green-500 to-emerald-600',
    'from-rose-500 to-violet-600',
];

export default function MentorPage() {
    const router = useRouter();

    const onTrack = menteeStudents.filter(s => s.status === 'On Track').length;
    const needsAttention = menteeStudents.filter(s => s.status === 'Needs Attention').length;
    const atRisk = menteeStudents.filter(s => s.status === 'At Risk').length;

    return (
        <AnimatedPage>
            <div className="max-w-5xl mx-auto pb-12">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-indigo-100 rounded-xl">
                                <HeartHandshake size={22} className="text-indigo-600" strokeWidth={2.5} />
                            </div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Mentor Dashboard</h1>
                        </div>
                        <p className="text-gray-500 font-medium text-sm ml-14">
                            Manage and monitor your assigned mentee students — CSE, 3rd Year A
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-5 mb-8">
                    {[
                        { label: 'Total Mentees', value: menteeStudents.length, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
                        { label: 'On Track', value: onTrack, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
                        { label: 'Needs Attention', value: needsAttention + atRisk, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
                    ].map(s => (
                        <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5 flex items-center gap-4 shadow-sm`}>
                            <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
                            <p className="text-sm font-bold text-gray-600 leading-tight">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Student Cards */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                        <UserCircle size={18} className="text-indigo-500" />
                        <h2 className="font-extrabold text-gray-800">My Mentee Students</h2>
                        <span className="ml-auto text-xs font-bold text-gray-400 uppercase tracking-wider">{menteeStudents.length} students</span>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {menteeStudents.map((student, idx) => {
                            const status = statusConfig[student.status];
                            const StatusIcon = status.icon;
                            return (
                                <div
                                    key={student.id}
                                    onClick={() => router.push(`/dashboard/faculty/mentor/${student.id}`)}
                                    className="flex items-center gap-5 p-5 hover:bg-indigo-50/40 cursor-pointer transition-all group"
                                >
                                    {/* Avatar */}
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white font-black text-lg shadow-md shrink-0`}>
                                        {student.avatar}
                                    </div>

                                    {/* Name + Reg */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-extrabold text-gray-900 text-base group-hover:text-indigo-700 transition">{student.name}</p>
                                        <p className="text-xs font-mono text-gray-500 mt-0.5">{student.registerNumber}</p>
                                    </div>

                                    {/* Dept */}
                                    <div className="hidden md:flex flex-col items-center w-24">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Dept</p>
                                        <p className="text-sm font-bold text-gray-700">{student.department}</p>
                                    </div>

                                    {/* Year */}
                                    <div className="hidden md:flex flex-col items-center w-24">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Year</p>
                                        <p className="text-sm font-bold text-gray-700">{student.year} {student.section}</p>
                                    </div>

                                    {/* Last Meeting */}
                                    <div className="hidden lg:flex flex-col items-center w-36">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Last Meeting</p>
                                        <div className="flex items-center gap-1 text-sm font-bold text-gray-700">
                                            <Calendar size={13} className="text-gray-400" />
                                            {new Date(student.lastMeetingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${status.bg} ${status.border} shrink-0`}>
                                        <span className={`w-2 h-2 rounded-full ${status.dot} inline-block`} />
                                        <StatusIcon size={12} className={status.color} strokeWidth={2.5} />
                                        <span className={`text-[11px] font-extrabold ${status.color} uppercase tracking-wide`}>{student.status}</span>
                                    </div>

                                    {/* Arrow */}
                                    <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-500 transition ml-2 shrink-0" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
}
