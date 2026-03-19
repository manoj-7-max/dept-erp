"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketProvider';
import Link from 'next/link';
import {
    Users, GraduationCap, BookOpen, Clock, AlertTriangle, MessageSquare,
    CheckCircle2, XCircle, FileText, Download, Activity, FileWarning, ArrowUpRight, ArrowDownRight, MoreHorizontal, Bell, Plus, CheckCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts';
import AnimatedPage from '@/components/AnimatedPage';

export default function HodDashboard() {
    const { user, token } = useAuth();
    const { socket } = useSocket() || {};
    // Using mock data for realistic ERP visualization since backend might not have all endpoints yet
    const [stats, setStats] = useState({ studentCount: 1240, facultyCount: 48, pendingRequests: 12 });
    const [liveFeed, setLiveFeed] = useState<{text: string, link: string}[]>([]);

    const studentsAbove75 = 1100;
    const studentsBetween65And75 = 220;
    const studentsBelow65 = 146;
    const averageAttendance = '86%';

    const pieData = [
        { name: 'Above 75%', value: studentsAbove75, color: '#22c55e', label: 'Safe Zone' },
        { name: '65% - 75%', value: studentsBetween65And75, color: '#f97316', label: 'Warning Zone' },
        { name: 'Below 65%', value: studentsBelow65, color: '#ef4444', label: 'Critical Zone' },
    ];
    
    const CustomPieTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const total = studentsAbove75 + studentsBetween65And75 + studentsBelow65;
            const percent = Math.round((data.value / total) * 100);
            return (
                <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100 min-w-[160px] animate-in fade-in zoom-in duration-200">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-50">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }}></div>
                        <span className="text-sm font-extrabold text-gray-800">{data.label}</span>
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-medium text-gray-500 gap-4">
                            <span>Students:</span>
                            <span className="font-bold text-gray-900">{data.value}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-medium text-gray-500 gap-4">
                            <span>Percentage:</span>
                            <span className="font-bold text-gray-900">{percent}%</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-medium text-gray-500 gap-4 mt-2">
                            <span>Trend:</span>
                            <span className={`font-bold flex items-center gap-0.5 ${data.name === 'Below 65%' ? 'text-red-500' : 'text-green-500'}`}>
                                {data.name === 'Below 65%' ? <ArrowDownRight size={12} strokeWidth={3}/> : <ArrowUpRight size={12} strokeWidth={3}/>} 
                                {data.name === 'Below 65%' ? 'needs work' : 'improving'}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    const [activeIndex, setActiveIndex] = useState(-1);
    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };
    const onPieLeave = () => {
        setActiveIndex(-1);
    };

    const renderActiveShape = (props: any) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + 8}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
            </g>
        );
    };

    // Mock Data
    const overviewCards = [
        { label: 'Total Students', value: 1240, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', link: '/dashboard/hod/students', trend: '+12%', trendUp: true },
        { label: 'Total Faculty', value: 48, icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50', link: '/dashboard/hod/faculty', trend: '+2', trendUp: true },
        { label: 'Subjects Running', value: 36, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', link: '/dashboard/hod/academics', trend: 'Same', trendUp: null },
        { label: 'Classes Today', value: 24, icon: Clock, color: 'text-cyan-600', bg: 'bg-cyan-50', link: '/dashboard/hod/reports/attendance', trend: '-2', trendUp: false },
        { label: 'Pending Requests', value: 12, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', link: '/dashboard/hod/faculty-requests', trend: '+4', trendUp: false },
        { label: 'Active Complaints', value: 3, icon: MessageSquare, color: 'text-red-600', bg: 'bg-red-50', link: '/dashboard/hod/complaints', trend: '-1', trendUp: true },
    ];

    const attendanceStats = [
        { label: 'Average Attendance', value: averageAttendance, sub: 'Dept. average', trend: 'up', icon: Activity, link: '/dashboard/hod/reports/attendance' },
        { label: 'Students Above 75%', value: studentsAbove75, sub: 'Safe zone', trend: 'up', icon: CheckCircle2, link: '/dashboard/hod/students?attendance=safe' },
        { label: 'Students 65%–75%', value: studentsBetween65And75, sub: 'Action required', trend: 'down', icon: AlertTriangle, link: '/dashboard/hod/students?attendance=warning' },
        { label: 'Students Below 65%', value: studentsBelow65, sub: 'Immediate warning', trend: 'down', icon: FileWarning, link: '/dashboard/hod/students?attendance=critical' },
    ];

    const todayLowAttendanceClasses = [
        { id: 'cls1', class: '2nd Year - Sec A', subject: 'Data Structures', faculty: 'Prof. Anitha', present: 48, total: 60, percentage: 80 },
        { id: 'cls2', class: '3rd Year - Sec B', subject: 'Operating Systems', faculty: 'Prof. Karthik', present: 38, total: 55, percentage: 69 },
        { id: 'cls3', class: '4th Year - Sec A', subject: 'Machine Learning', faculty: 'Dr. Suresh', present: 40, total: 55, percentage: 72 },
    ].sort((a, b) => a.percentage - b.percentage); // Lowest attendance first

    const academicProgress = [
        { id: 'sub1', subject: 'Data Structures', faculty: 'Prof. Anitha', progress: 75, status: 'On Track' },
        { id: 'sub2', subject: 'Computer Networks', faculty: 'Dr. Ramesh', progress: 60, status: 'Behind Schedule' },
        { id: 'sub3', subject: 'Cloud Computing', faculty: 'Prof. Priya', progress: 100, status: 'Completed' },
    ];

    const pendingApprovals = [
        { id: 'req1', type: 'Leave Request', by: 'Prof. Karthik', date: '05 Mar 2026', status: 'Pending', link: '/dashboard/hod/faculty-requests' },
        { id: 'req2', type: 'OD Request', by: 'Dr. Subramani', date: '04 Mar 2026', status: 'Pending', link: '/dashboard/hod/faculty-requests' },
        { id: 'req3', type: 'Lesson Plan', by: 'Prof. Anitha', date: '03 Mar 2026', status: 'Pending', link: '/dashboard/hod/academics' },
    ];

    const facultyPerformance = [
        { id: 'fac1', name: 'Prof. Anitha', subjects: 2, progress: 85, publications: 2 },
        { id: 'fac2', name: 'Dr. Suresh', subjects: 1, progress: 90, publications: 5 },
        { id: 'fac3', name: 'Dr. Ramesh', subjects: 2, progress: 65, publications: 1 },
    ];

    useEffect(() => {
        // Initial static history block
        setLiveFeed([
            { text: 'Attendance submitted for 2nd Year A (Data Structures)', link: '/dashboard/hod/reports/attendance' },
            { text: 'Lesson plan uploaded by Prof. Karthik', link: '/dashboard/hod/academics' },
            { text: 'Complaint submitted by Staff ID: ST004', link: '/dashboard/hod/complaints/staff' },
            { text: 'Leave request approved for Dr. Priya', link: '/dashboard/hod/faculty-requests' },
        ]);

        if (!socket) return;

        // Two-way synchronization event bindings
        const handleNewCircular = (data: any) => setLiveFeed(prev => [{ text: `New circular posted: ${data.title}`, link: '/dashboard/hod/circulars' }, ...prev]);
        const handleRequestUpdated = (data: any) => setLiveFeed(prev => [{ text: `Request ${data.status.replace('_', ' ').toLowerCase()}`, link: '/dashboard/hod/requests' }, ...prev]);
        const handleNewMessage = () => setLiveFeed(prev => [{ text: `New message received`, link: '/dashboard/messages' }, ...prev]);

        socket.on('new_circular', handleNewCircular);
        socket.on('request_updated', handleRequestUpdated);
        socket.on('new_message', handleNewMessage);

        return () => {
            socket.off('new_circular', handleNewCircular);
            socket.off('request_updated', handleRequestUpdated);
            socket.off('new_message', handleNewMessage);
        };
    }, [socket]);

    return (
        <AnimatedPage>
        <div className="p-8 md:p-10 bg-gray-50/50 min-h-screen font-sans text-gray-800">
            {/* Header */}
            <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-200/60">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm page-title-underline">HOD Automation</h1>
                    <p className="text-gray-500 mt-2 font-medium text-sm tracking-wide">Department Monitoring & Academic Management</p>
                </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="flex flex-wrap gap-4 mb-8">
                <Link href="/dashboard/hod/circulars" className="flex items-center gap-3 bg-white hover:bg-indigo-50 border border-gray-100 px-6 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors"><Bell size={18} strokeWidth={2.5} /></div>
                    <span className="font-extrabold text-sm text-gray-700 group-hover:text-indigo-900 transition-colors tracking-wide">Post Circular</span>
                </Link>
                <Link href="/dashboard/hod/requests" className="flex items-center gap-3 bg-white hover:bg-orange-50 border border-gray-100 px-6 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors"><CheckCircle2 size={18} strokeWidth={2.5} /></div>
                    <span className="font-extrabold text-sm text-gray-700 group-hover:text-orange-900 transition-colors tracking-wide">Verify Requests</span>
                </Link>
                <Link href="/dashboard/hod/reports" className="flex items-center gap-3 bg-white hover:bg-blue-50 border border-gray-100 px-6 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors"><FileText size={18} strokeWidth={2.5} /></div>
                    <span className="font-extrabold text-sm text-gray-700 group-hover:text-blue-900 transition-colors tracking-wide">Generate Reports</span>
                </Link>
            </div>

            {/* 1. Department Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12 reveal-section">
                {overviewCards.map((card, i) => (
                    <Link href={card.link} key={i}>
                        <div className="stat-card bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col card-hover card-glow cursor-pointer h-full group relative overflow-hidden reveal">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`stat-icon p-4 rounded-2xl ${card.bg} ${card.color} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 icon-hover-bounce`}>
                                    <card.icon size={26} strokeWidth={2.5} />
                                </div>
                                {card.trendUp !== null && (
                                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm ${card.trendUp ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                        {card.trendUp ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />} {card.trend}
                                    </div>
                                )}
                            </div>
                            <div className="mt-auto">
                                <p className="stat-value text-3xl font-black text-gray-800 tracking-tight">{card.value}</p>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1.5">{card.label}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* 2. Attendance Analytics Section */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-5">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Activity size={20} />
                        </div>
                        <h2 className="text-xl font-extrabold text-gray-800">Attendance Analytics</h2>
                    </div>

                    <div className="mb-10">
                        <h3 className="text-sm font-bold text-gray-800 mb-5">Attendance Health Summary</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {attendanceStats.map((stat, i) => (
                                <Link href={stat.link} key={i}>
                                    <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-lg hover:border-blue-100 transition-all duration-300 cursor-pointer h-full group">
                                        <div className="flex justify-between items-start mb-4">
                                            <stat.icon size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                            {stat.trend === 'up' ? <ArrowUpRight size={16} className="text-green-500" /> : <ArrowDownRight size={16} className="text-red-500" />}
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-800 tracking-tight">{stat.value}</h3>
                                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-1">{stat.label}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="mb-0 pt-6 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-gray-800 mb-6">Attendance Distribution Pie Chart</h3>
                        <div className="h-48 w-full cursor-pointer relative flex justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="90%"
                                        startAngle={180}
                                        endAngle={0}
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={2}
                                        dataKey="value"
                                        animationBegin={200}
                                        animationDuration={1000}
                                        onMouseEnter={onPieEnter}
                                        onMouseLeave={onPieLeave}
                                        {...({ activeIndex, activeShape: renderActiveShape } as any)}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} className="outline-none" />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomPieTooltip />} cursor={{fill: 'transparent'}} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-6 mt-4 mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
                                <span className="text-xs font-bold text-gray-600">Above 75% <span className="text-gray-400 font-medium">(Safe Zone)</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-500 shadow-sm"></div>
                                <span className="text-xs font-bold text-gray-600">65–75% <span className="text-gray-400 font-medium">(Warning Zone)</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
                                <span className="text-xs font-bold text-gray-600">Below 65% <span className="text-gray-400 font-medium">(Critical Zone)</span></span>
                            </div>
                        </div>
                    </div>

                    {/* 3. CSS Bar Chart Visualization */}
                    <div className="pt-6 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-gray-800 mb-6">Weekly Attendance Trend</h3>
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Historical Trend</h3>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-1.5 align-middle"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div><span className="text-xs font-bold text-gray-500">Safe</span></div>
                                    <div className="flex items-center gap-1.5 align-middle"><div className="w-2.5 h-2.5 rounded-full bg-orange-400"></div><span className="text-xs font-bold text-gray-500">Warning</span></div>
                                </div>
                            </div>
                            <div className="flex items-end gap-3 h-32 w-full pt-4 relative">
                                {/* Horizontal grid lines */}
                                <div className="absolute inset-x-0 bottom-0 h-px bg-gray-200"></div>
                                <div className="absolute inset-x-0 bottom-[33%] h-px bg-gray-200/50 dashed"></div>
                                <div className="absolute inset-x-0 bottom-[66%] h-px bg-gray-200/50 dashed"></div>
                                <div className="absolute inset-x-0 top-0 h-px bg-gray-200/50 dashed"></div>
                                
                                {/* Bars */}
                                {[75, 82, 95, 68, 85, 90, 78, 88].map((val, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col justify-end items-center group relative cursor-pointer z-10 h-full">
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-800 text-white text-[10px] py-1 px-2 rounded-md font-bold transition-opacity whitespace-nowrap">{val}%</div>
                                        <div className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 group-hover:opacity-80 shadow-sm ${val >= 75 ? 'bg-gradient-to-t from-blue-600 to-blue-400' : 'bg-gradient-to-t from-orange-500 to-orange-400'}`} style={{ height: `${val}%` }}></div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-3 px-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <span className="flex-1 text-center">Mon</span><span className="flex-1 text-center">Tue</span><span className="flex-1 text-center">Wed</span><span className="flex-1 text-center">Thu</span><span className="flex-1 text-center">Fri</span><span className="flex-1 text-center">Sat</span><span className="flex-1 text-center">Sun</span><span className="flex-1 text-center">Mon</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 7. Complaints & 9. Reports Section */}
                <div className="flex flex-col gap-8">
                    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-8 flex flex-col">
                        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                                    <MessageSquare size={18} />
                                </div>
                                <h2 className="text-lg font-extrabold text-gray-900">Complaints Pulse</h2>
                            </div>
                            <div className="bg-green-50 text-green-700 font-bold px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 border border-green-200 shadow-sm">
                                <CheckCircle2 size={14} strokeWidth={2.5} /> 83% Resolution Rate
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <Link href="/dashboard/hod/complaints" className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex flex-col items-center justify-center hover:bg-white hover:border-gray-300 hover:shadow-md transition-all cursor-pointer group">
                                <p className="text-3xl font-black text-gray-800 group-hover:text-blue-600 transition-colors">18</p>
                                <span className="bg-gray-200/80 text-gray-600 px-2.5 py-1 mt-2 rounded-lg text-[9px] font-bold uppercase tracking-widest">Total</span>
                            </Link>
                            <Link href="/dashboard/hod/complaints?status=pending" className="bg-red-50 border border-red-100 p-4 rounded-2xl flex flex-col items-center justify-center hover:bg-white hover:border-red-200 hover:shadow-md transition-all cursor-pointer group">
                                <p className="text-3xl font-black text-red-600 group-hover:text-red-700 transition-colors">3</p>
                                <span className="bg-red-200/80 text-red-700 px-2.5 py-1 mt-2 rounded-lg text-[9px] font-bold uppercase tracking-widest">Pending</span>
                            </Link>
                            <Link href="/dashboard/hod/complaints?status=resolved" className="bg-green-50 border border-green-100 p-4 rounded-2xl flex flex-col items-center justify-center hover:bg-white hover:border-green-200 hover:shadow-md transition-all cursor-pointer group">
                                <p className="text-3xl font-black text-green-600 group-hover:text-green-700 transition-colors">15</p>
                                <span className="bg-green-200/80 text-green-800 px-2.5 py-1 mt-2 rounded-lg text-[9px] font-bold uppercase tracking-widest">Resolved</span>
                            </Link>
                        </div>
                        
                        {/* Complaints Trend Chart */}
                        <div className="mt-2">
                            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">7-Day Trend</h3>
                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                <div className="flex items-end gap-2 h-24 w-full relative">
                                    {/* Horizontal grid lines */}
                                    <div className="absolute inset-x-0 bottom-[50%] h-px bg-gray-200/80 border-t border-gray-200 border-dashed w-full pointer-events-none"></div>
                                    <div className="absolute inset-x-0 top-0 h-px bg-gray-200/80 border-t border-gray-200 border-dashed w-full pointer-events-none"></div>

                                    {[1, 3, 2, 5, 2, 4, 3].map((val, idx) => (
                                        <div key={idx} className="flex-1 flex justify-center group relative h-full">
                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-800 text-white text-[10px] py-1 px-2 rounded-md font-bold transition-opacity whitespace-nowrap z-20 pointer-events-none">{val} issues</div>
                                            <div className="w-full max-w-[28px] bg-gradient-to-t from-red-600 to-red-400 rounded-t-lg transition-all duration-300 group-hover:opacity-80 self-end shadow-sm relative z-10" style={{ height: `${(val/5)*100}%` }}></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2 mt-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-t border-gray-100 pt-3">
                                    <span className="flex-1 text-center">M</span>
                                    <span className="flex-1 text-center">T</span>
                                    <span className="flex-1 text-center">W</span>
                                    <span className="flex-1 text-center">T</span>
                                    <span className="flex-1 text-center">F</span>
                                    <span className="flex-1 text-center">S</span>
                                    <span className="flex-1 text-center">S</span>
                                </div>
                            </div>
                        </div>
                        
                        <Link href="/dashboard/hod/complaints" className="mt-6 w-full text-center block bg-gray-50 border border-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 py-3 rounded-xl font-bold text-sm shadow-sm transition-all">
                            View All Complaints &rarr;
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-3">
                            <FileText size={18} className="text-purple-600" />
                            <h2 className="text-md font-extrabold text-gray-900">Generate Reports</h2>
                        </div>
                        <div className="space-y-3">
                            <Link href="/dashboard/hod/reports/attendance" className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 hover:shadow-sm border border-gray-100 rounded-xl transition cursor-pointer group">
                                <span className="text-xs font-bold text-gray-700 group-hover:text-blue-600 transition-colors">Attendance Report</span>
                                <Download size={14} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                            </Link>
                            <Link href="/dashboard/hod/reports/academic" className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 hover:shadow-sm border border-gray-100 rounded-xl transition cursor-pointer group">
                                <span className="text-xs font-bold text-gray-700 group-hover:text-blue-600 transition-colors">Academic Report</span>
                                <Download size={14} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                            </Link>
                            <Link href="/dashboard/hod/reports/faculty" className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 hover:shadow-sm border border-gray-100 rounded-xl transition cursor-pointer group">
                                <span className="text-xs font-bold text-gray-700 group-hover:text-blue-600 transition-colors">Faculty Performance</span>
                                <Download size={14} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                {/* 3. Class Monitoring Panel */}
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col h-full">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-white">
                        <div>
                            <h2 className="text-lg font-extrabold text-gray-800 flex items-center gap-2 mb-1.5">
                                <AlertTriangle size={18} className="text-red-500" strokeWidth={2.5} /> 
                                Today's Class Attendance
                            </h2>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                Low Attendance Alerts • {todayLowAttendanceClasses.length} Classes
                            </p>
                        </div>
                        <Link href="/dashboard/hod/reports/attendance" className="text-xs font-bold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 px-4 py-2 rounded-xl transition-colors cursor-pointer border border-blue-100 hover:border-blue-600 shadow-sm whitespace-nowrap">
                            View Full Attendance Report &rarr;
                        </Link>
                    </div>
                    
                    <div className="p-6 bg-gray-50/50 flex-1">
                        {todayLowAttendanceClasses.length === 0 ? (
                            <div className="py-12 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm h-full">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm border border-green-200">
                                    <CheckCircle2 size={32} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-lg font-extrabold text-gray-800 mb-1">All Clear!</h3>
                                <p className="text-sm font-medium text-gray-500">All classes today have healthy attendance.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {todayLowAttendanceClasses.map((cls, i) => {
                                    const isCritical = cls.percentage < 70;
                                    const isWarning = cls.percentage >= 70 && cls.percentage < 85;
                                    const isSafe = cls.percentage >= 85;
                                    
                                    const barColor = isCritical ? 'bg-red-500' : isWarning ? 'bg-orange-400' : 'bg-green-500';
                                    const badgeBg = isCritical ? 'bg-red-50' : isWarning ? 'bg-orange-50' : 'bg-green-50';
                                    const badgeBorder = isCritical ? 'border-red-200' : isWarning ? 'border-orange-200' : 'border-green-200';
                                    const badgeText = isCritical ? 'text-red-700' : isWarning ? 'text-orange-700' : 'text-green-700';
                                    const statusText = isCritical ? 'CRITICAL' : isWarning ? 'WARNING' : 'SAFE';

                                    return (
                                        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-0.5" onClick={() => window.location.href = `/dashboard/hod/classes/${cls.id}`}>
                                            {/* Vertical Color Indicator Bar */}
                                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${barColor}`}></div>
                                            
                                            <div className="flex-1 pl-3">
                                                <h3 className="font-extrabold text-gray-800 text-sm mb-1 group-hover:text-blue-600 transition-colors">{cls.class}</h3>
                                                <p className="text-xs font-semibold text-gray-500">
                                                    {cls.subject} <span className="mx-1.5 text-gray-300 font-light">|</span> <span className="text-gray-700">{cls.faculty}</span>
                                                </p>
                                            </div>
                                            
                                            <div className="flex items-center gap-6 text-right">
                                                <div className="hidden sm:block">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Attendance</p>
                                                    <p className="text-sm font-black text-gray-800 flex items-center justify-end gap-2">
                                                        <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{cls.present} / {cls.total}</span>
                                                        <span className="text-gray-400 font-bold">&rarr;</span>
                                                        <span className={badgeText}>{cls.percentage}%</span>
                                                    </p>
                                                </div>
                                                <div className="w-20">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 text-center">Status</p>
                                                    <div className="flex justify-center">
                                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${badgeBorder} ${badgeBg} ${badgeText}`}>
                                                            {statusText}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. Academic Progress Tracker */}
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-white">
                        <h2 className="text-lg font-extrabold text-gray-800 flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><BookOpen size={18} /></div> Syllabus Progress
                        </h2>
                    </div>
                    <table className="table-modern w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 px-6 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Subject</th>
                                <th className="p-4 px-6 text-xs font-extrabold text-gray-500 uppercase tracking-wider text-center">Progress</th>
                                <th className="p-4 px-6 text-xs font-extrabold text-gray-500 uppercase tracking-wider text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {academicProgress.map((prog, i) => (
                                <tr key={i} className="cursor-pointer group" onClick={() => window.location.href = `/dashboard/hod/academics/subject/${prog.id}`}>
                                    <td className="p-4 px-6">
                                        <div className="font-bold text-gray-800 text-sm mb-1 group-hover:text-blue-600 transition-colors">{prog.subject}</div>
                                        <div className="text-xs font-medium text-gray-500">{prog.faculty}</div>
                                    </td>
                                    <td className="p-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full progress-animated ${prog.progress < 70 ? 'bg-orange-500' : 'bg-blue-600'}`} style={{ width: `${prog.progress}%` }}></div>
                                            </div>
                                            <span className="text-xs font-bold text-gray-700">{prog.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4 px-6 text-right">
                                        <span className={`text-xs font-bold uppercase ${prog.status === 'Completed' ? 'text-green-600' :
                                            prog.status === 'On Track' ? 'text-blue-600' : 'text-orange-600'
                                            }`}>{prog.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 5. Pending Approvals Panel */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-white">
                        <h2 className="text-lg font-extrabold text-gray-800 flex items-center gap-3">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><AlertTriangle size={18} /></div> Pending Approvals
                        </h2>
                    </div>
                    <table className="table-modern w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="p-5 px-6 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Request</th>
                                <th className="p-5 px-6 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Submitted By</th>
                                <th className="p-5 px-6 text-xs font-extrabold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pendingApprovals.map((req, i) => (
                                <tr key={i} className="cursor-pointer group" onClick={() => window.location.href = req.link}>
                                    <td className="p-5 px-6">
                                        <div className="font-bold text-gray-800 text-sm mb-1 group-hover:text-blue-600 transition-colors">{req.type}</div>
                                        <div className="text-xs font-medium text-gray-500">{req.date}</div>
                                    </td>
                                    <td className="p-5 px-6 text-sm font-semibold text-gray-700">{req.by}</td>
                                    <td className="p-5 px-6 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                className="btn-animate text-xs font-bold text-blue-700 bg-blue-50/80 border border-blue-200 hover:bg-blue-100 px-4 py-1.5 rounded-lg cursor-pointer"
                                                onClick={(e) => { e.stopPropagation(); window.location.href = req.link; }}
                                            >View</button>
                                            <button
                                                className="btn-animate btn-approve text-xs font-bold text-white bg-green-500 hover:bg-green-600 px-4 py-1.5 rounded-lg cursor-pointer shadow-md shadow-green-500/20"
                                                onClick={(e) => { e.stopPropagation(); alert(`Approved request ${req.id}`); }}
                                            >Approve</button>
                                            <button
                                                className="btn-animate btn-reject text-xs font-bold text-gray-600 bg-gray-100 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200 px-4 py-1.5 rounded-lg cursor-pointer"
                                                onClick={(e) => { e.stopPropagation(); alert(`Rejected request ${req.id}`); }}
                                            >Reject</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 6. Faculty Performance Snapshot & 8. Recent Activities */}
                <div className="flex flex-col gap-8">
                    {/* Faculty Performance Snapshot */}
                    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 bg-white">
                            <h2 className="text-base font-extrabold text-gray-800 flex items-center gap-3">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><GraduationCap size={16} /></div> Faculty Performance
                            </h2>
                        </div>
                        <div className="p-2 space-y-1">
                            {facultyPerformance.map((fac, i) => (
                                <Link href={`/dashboard/hod/faculty/${fac.id}`} key={i}>
                                    <div className="flex justify-between items-center p-4 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group">
                                        <div>
                                            <p className="font-bold text-gray-800 text-sm mb-1.5 group-hover:text-blue-600 transition-colors">{fac.name}</p>
                                            <div className="flex gap-2 text-xs">
                                                <span className="font-bold text-gray-600 bg-gray-100/80 px-2 py-0.5 rounded-md">{fac.subjects} Subjects</span>
                                                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">{fac.publications} Pubs</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Syllabus</p>
                                            <p className={`text-base font-black ${fac.progress > 80 ? 'text-green-600' : 'text-orange-500'}`}>{fac.progress}%</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-extrabold text-gray-900 flex items-center gap-2 text-sm">
                                <Bell size={16} className="text-gray-400" /> Activity Feed
                            </h3>
                        </div>
                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-200 before:to-transparent">
                            {liveFeed.slice(0, 5).map((item, i) => (
                                <Link href={item.link} key={i}>
                                    <div className="relative flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition cursor-pointer group">
                                        <div className="w-4 h-4 rounded-full bg-blue-100 border-2 border-white shadow-sm mt-0.5 z-10 shrink-0 group-hover:bg-blue-400 transition-colors"></div>
                                        <p className="text-xs font-medium text-gray-600 group-hover:text-blue-700 transition-colors">{item.text}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
        </AnimatedPage>
    );
}
