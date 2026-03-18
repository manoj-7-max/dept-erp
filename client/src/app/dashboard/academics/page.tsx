"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    BookOpen,
    Calendar,
    ClipboardList,
    BarChart3,
    AlertCircle,
    Download,
    Eye,
    Edit,
    UserPlus,
    CheckCircle2,
    XCircle,
    History,
    Filter,
    ChevronRight,
    Search,
    BookCheck,
    Bell,
    Clock,
    FileWarning,
    UserX,
    CheckCircle,
    Users,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

export default function AcademicsPage() {
    const { user } = useAuth();
    const isHOD = user?.role === 'hod';
    const canEdit = user?.role === 'hod' || user?.role === 'faculty';
    const [activeTab, setActiveTab] = useState('SYLLABUS');
    const [selectedSem, setSelectedSem] = useState<number | null>(null);

    // --- Mock Data ---
    const summaryStats = [
        { label: 'Total Subjects', value: 48, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'On Track', value: 32, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Behind Schedule', value: 6, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
        { label: 'Avg. Completion', value: '68%', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    const academicAlerts = [
        { title: 'Lesson Plans Pending Approval', desc: '12 subjects in 4th & 6th Sem.', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
        { title: 'IAT Marks Overdue', desc: 'Operating Systems (Sec B) - IAT 1', icon: FileWarning, color: 'text-red-500', bg: 'bg-red-50' },
        { title: 'Faculty Unassigned', desc: 'Elective IV for 8th Sem Section A', icon: UserX, color: 'text-blue-500', bg: 'bg-blue-50' },
    ];

    const semesterData = [
        { sem: 1, program: 'B.E Computer Science', subjects: 6, progress: 95, faculty: 6 },
        { sem: 2, program: 'B.E Computer Science', subjects: 7, progress: 82, faculty: 7 },
        { sem: 3, program: 'B.E Computer Science', subjects: 6, progress: 75, faculty: 6 },
        { sem: 4, program: 'B.E Computer Science', subjects: 8, progress: 55, faculty: 8 },
        { sem: 5, program: 'B.E Computer Science', subjects: 5, progress: 40, faculty: 5 },
        { sem: 6, program: 'B.E Computer Science', subjects: 7, progress: 20, faculty: 7 },
        { sem: 7, program: 'B.E Computer Science', subjects: 4, progress: 10, faculty: 4 },
        { sem: 8, program: 'B.E Computer Science', subjects: 3, progress: 5, faculty: 3 },
    ];

    const detailedSubjects = [
        { code: 'CS8391', name: 'Data Structures', faculty: 'Prof. Anitha', year: 2, section: 'A', progress: 75, status: 'On Track' },
        { code: 'CS8392', name: 'Object Oriented Programming', faculty: 'Dr. Subramani', year: 2, section: 'A', progress: 68, status: 'On Track' },
        { code: 'CS8393', name: 'Digital Logic', faculty: 'Dr. Ramesh', year: 2, section: 'A', progress: 45, status: 'Behind Schedule' },
        { code: 'CS8491', name: 'Operating Systems', faculty: 'Prof. Karthik', year: 2, section: 'B', progress: 90, status: 'Completed' },
    ];

    const lessonPlans = [
        { subject: 'Data Structures', faculty: 'Prof. Anitha', date: '2026-03-01', status: 'Pending Approval' },
        { subject: 'Operating Systems', faculty: 'Prof. Karthik', date: '2026-02-28', status: 'Approved' },
        { subject: 'Machine Learning', faculty: 'Dr. Suresh', date: '2026-03-03', status: 'Rejected' },
    ];

    const ciaMonitoring = [
        { subject: 'Data Structures', faculty: 'Prof. Anitha', cia1: 'Submitted', cia2: 'Pending', overall: 'In Progress' },
        { subject: 'Networking', faculty: 'Dr. Priya', cia1: 'Approved', cia2: 'Submitted', overall: 'Ready' },
    ];

    const updateHistory = [
        { date: '04 Mar 2026', action: 'Modified Semester 4 Syllabus', user: 'HOD' },
        { date: '03 Mar 2026', action: 'Assigned Faculty for ML Lab', user: 'HOD' },
        { date: '01 Mar 2026', action: 'Approved 15 Lesson Plans', user: 'HOD' },
    ];

    const facultyMonitoringData = [
        { name: 'Dr. V. S. Thiyagarajan', year: '2nd Year', lessonPlan: 100, attendance: 85, marks: 45, notes: 90, logbook: 75 },
        { name: 'Ms. G. Vinitha', year: '3rd Year', lessonPlan: 80, attendance: 100, marks: 100, notes: 20, logbook: 90 },
        { name: 'Ms. K. Vani Shree', year: '1st Year', lessonPlan: 30, attendance: 90, marks: 0, notes: 40, logbook: 30 },
        { name: 'Ms. S. Gayathri', year: '4th Year', lessonPlan: 100, attendance: 0, marks: 0, notes: 100, logbook: 0 },
        { name: 'Dr. Subramani V', year: '2nd Year', lessonPlan: 100, attendance: 100, marks: 100, notes: 100, logbook: 100 },
    ];

    const getProgressColor = (percent: number) => {
        if (percent >= 80) return 'bg-green-500';
        if (percent >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const [selectedYear, setSelectedYear] = useState('All Years');
    const [selectedFacultyMember, setSelectedFacultyMember] = useState('All Faculty');

    const facultyList = Array.from(new Set(facultyMonitoringData.map(f => f.name)));
    const filteredFacultyMonitoring = facultyMonitoringData.filter(f => {
        const matchesYear = selectedYear === 'All Years' || f.year === selectedYear;
        const matchesFaculty = selectedFacultyMember === 'All Faculty' || f.name === selectedFacultyMember;
        return matchesYear && matchesFaculty;
    });
    const [facultySubmissions, setFacultySubmissions] = useState([
        { id: 'f1', name: 'Ms. G. Vinitha', email: 'g.vinitha@kvcet.edu', designation: 'Assistant Professor', lessonPlan: 'Uploaded', notes: 'Uploaded', logbook: 'Uploaded', iatMarks: 'Uploaded', status: 'Pending Approval', progress: 85 },
        { id: 'f2', name: 'Ms. K. Vani Shree', email: 'k.vanishree@kvcet.edu', designation: 'Assistant Professor', lessonPlan: 'Uploaded', notes: 'Uploaded', logbook: 'Pending', iatMarks: 'Uploaded', status: 'Pending Approval', progress: 70 },
        { id: 'f3', name: 'Ms. S. Gayathri', email: 's.gayathri@kvcet.edu', designation: 'Assistant Professor', lessonPlan: 'Uploaded', notes: 'Uploaded', logbook: 'Uploaded', iatMarks: 'Uploaded', status: 'Pending Approval', progress: 90 },
        { id: 'f4', name: 'Dr. V. S. Thiyagarajan', email: 'v.s.thiyagarajan@kvcet.edu', designation: 'Professor', lessonPlan: 'Uploaded', notes: 'Uploaded', logbook: 'Uploaded', iatMarks: 'Uploaded', status: 'Pending Approval', progress: 95 },
        { id: 'f5', name: 'Ms. M. Muthuselvi', email: 'm.muthuselvi@kvcet.edu', designation: 'Assistant Professor', lessonPlan: 'Uploaded', notes: 'Pending', logbook: 'Pending', iatMarks: 'Pending', status: 'Pending Approval', progress: 40 },
        { id: 'f6', name: 'Ms. Usha Devi', email: 'ushadevi@kvcet.edu', designation: 'Assistant Professor', lessonPlan: 'Uploaded', notes: 'Uploaded', logbook: 'Uploaded', iatMarks: 'Uploaded', status: 'Pending Approval', progress: 88 },
        { id: 'f7', name: 'Ms. Bhuviya', email: 'bhuviya@kvcet.edu', designation: 'Trainer', lessonPlan: 'Uploaded', notes: 'Uploaded', logbook: 'Pending', iatMarks: 'Pending', status: 'Pending Approval', progress: 60 },
    ]);

    const [approvalModalOpen, setApprovalModalOpen] = useState(false);
    const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

    const handleApproveClick = (id: string) => {
        setSelectedSubmissionId(id);
        setApprovalModalOpen(true);
    };

    const confirmApproval = () => {
        if (selectedSubmissionId) {
            setFacultySubmissions(prev => prev.map(sub => {
                if (sub.id === selectedSubmissionId) {
                    return { ...sub, status: 'Approved', progress: Math.min(100, sub.progress + 10) };
                }
                return sub;
            }));
        }
        setApprovalModalOpen(false);
        setSelectedSubmissionId(null);
    };

    const handleRejectClick = (id: string) => {
        setFacultySubmissions(prev => prev.map(sub =>
            sub.id === id ? { ...sub, status: 'Rejected' } : sub
        ));
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

    const toggleRow = (id: string) => {
        setExpandedRowId(expandedRowId === id ? null : id);
    };

    const filteredSubmissions = facultySubmissions.filter(sub => {
        const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
        const completionCount = ['lessonPlan', 'notes', 'logbook', 'iatMarks'].filter(k => sub[k as keyof typeof sub] === 'Uploaded').length;
        const progressPct = (completionCount / 4) * 100;
        
        let matchesStatus = true;
        if (statusFilter === 'Completed') matchesStatus = progressPct === 100;
        if (statusFilter === 'Pending') matchesStatus = sub.status === 'Pending Approval';
        if (statusFilter === 'Needs Attention') matchesStatus = sub.status === 'Rejected' || progressPct < 50 || completionCount < 4;

        return matchesSearch && matchesStatus;
    });

    const itemsPerPage = 5;
    const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
    const paginatedSubmissions = filteredSubmissions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalFaculty = facultySubmissions.length;
    const completedSubmissions = facultySubmissions.filter(s => s.lessonPlan === 'Uploaded' && s.notes === 'Uploaded' && s.logbook === 'Uploaded' && s.iatMarks === 'Uploaded').length;
    const pendingSubmissions = facultySubmissions.filter(s => s.status === 'Pending Approval').length;
    const requiresAttention = facultySubmissions.filter(s => s.status === 'Rejected' || s.progress < 50 || s.lessonPlan !== 'Uploaded' || s.notes !== 'Uploaded' || s.logbook !== 'Uploaded' || s.iatMarks !== 'Uploaded').length;

    return (
        <div className="p-8 bg-gray-50 min-h-screen text-gray-800 font-sans">
            {/* Header with Dashboard Title */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Academic ERP Dashboard</h1>
                    <p className="text-gray-500 mt-1 font-medium text-sm">HOD Monitoring & Curriculum Management</p>
                </div>
                {canEdit && (
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-sm hover:bg-blue-700 hover:shadow transition-all font-semibold text-sm">
                        <BookCheck size={18} /> Update Curriculum
                    </button>
                )}
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {summaryStats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 transition hover:shadow-md">
                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={26} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
                            <p className="text-3xl font-black text-gray-900 leading-none">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Layout Container */}
            <div className="w-full flex flex-col space-y-10">
                {/* Academic Filters */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-5 text-gray-800 font-bold border-b border-gray-100 pb-4">
                        <Filter size={18} className="text-blue-600" />
                        Academic Filters
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Department</label>
                            <div className="w-full bg-gray-100 border-gray-200 border text-sm font-bold p-2.5 rounded-xl text-gray-500 flex items-center shadow-inner cursor-not-allowed">
                                {user?.department || 'CSE'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Regulation</label>
                            <select className="w-full bg-gray-50 border-gray-200 border text-sm font-semibold p-2.5 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition">
                                <option>R2023</option>
                                <option>R2021</option>
                                <option>R2017</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Academic Year</label>
                            <select className="w-full bg-gray-50 border-gray-200 border text-sm font-semibold p-2.5 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition">
                                <option>2025–2026</option>
                                <option>2024–2025</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Semester</label>
                            <select className="w-full bg-gray-50 border-gray-200 border text-sm font-semibold p-2.5 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition">
                                <option>All Semesters</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s}>Semester {s}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Grid for Table and Alerts */}
                <div className="grid grid-cols-1 gap-10">
                    {/* Faculty Academic Progress Monitoring */}
                    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h2 className="text-lg font-extrabold text-gray-800 flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><BookOpen size={18} strokeWidth={2.5} /></div> 
                                Faculty Academic Progress Monitoring
                            </h2>
                        </div>
                        <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex flex-col md:flex-row gap-4">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex-1 flex items-center justify-between group hover:border-blue-200 transition-colors">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors">Total Faculty</p>
                                    <p className="text-2xl font-black text-gray-900 leading-none">{totalFaculty}</p>
                                </div>
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform"><Users size={20} strokeWidth={2.5} /></div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex-1 flex items-center justify-between group hover:border-green-200 transition-colors">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-green-500 transition-colors">Completed</p>
                                    <p className="text-2xl font-black text-gray-900 leading-none">{completedSubmissions}</p>
                                </div>
                                <div className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:scale-110 transition-transform"><CheckCircle2 size={20} strokeWidth={2.5} /></div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex-1 flex items-center justify-between group hover:border-orange-200 transition-colors">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-orange-500 transition-colors">Pending</p>
                                    <p className="text-2xl font-black text-gray-900 leading-none">{pendingSubmissions}</p>
                                </div>
                                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:scale-110 transition-transform"><Clock size={20} strokeWidth={2.5} /></div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex-1 flex items-center justify-between group hover:border-red-200 transition-colors">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-red-500 transition-colors">Attention Reqd</p>
                                    <p className="text-2xl font-black text-gray-900 leading-none">{requiresAttention}</p>
                                </div>
                                <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:scale-110 transition-transform"><AlertCircle size={20} strokeWidth={2.5} /></div>
                            </div>
                        </div>

                        {/* Search & Filter Header */}
                        <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Search faculty name..." 
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                />
                            </div>
                            <div className="w-full md:w-auto flex items-center gap-3">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden md:block">Filter by:</label>
                                <select 
                                    className="bg-gray-50 border border-gray-200 text-sm font-semibold p-2 w-full md:w-48 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition hover:bg-gray-100"
                                    value={statusFilter}
                                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                                >
                                    <option value="All">All Submissions</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Pending">Pending Approval</option>
                                    <option value="Needs Attention">Needs Attention</option>
                                </select>
                            </div>
                        </div>

                        {/* Scalable Table Layout */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="bg-gray-50/80 border-b border-gray-100">
                                    <tr>
                                        <th className="p-4 px-6 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Faculty Name</th>
                                        <th className="p-4 px-3 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider text-center">LP</th>
                                        <th className="p-4 px-3 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider text-center">Notes</th>
                                        <th className="p-4 px-3 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider text-center">Logbook</th>
                                        <th className="p-4 px-3 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider text-center">IAT</th>
                                        <th className="p-4 px-6 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider text-center">Overall</th>
                                        <th className="p-4 px-6 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider text-center">Status</th>
                                        <th className="p-4 px-6 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {paginatedSubmissions.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="p-8 text-center text-gray-500 font-medium">
                                                No faculty found matching the current filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedSubmissions.map((sub, i) => {
                                            const completedCount = ['lessonPlan', 'notes', 'logbook', 'iatMarks'].filter(k => sub[k as keyof typeof sub] === 'Uploaded').length;
                                            const progressPct = (completedCount / 4) * 100;
                                            const isExpanded = expandedRowId === sub.id;

                                            const getIcon = (status: string) => {
                                                if (status === 'Uploaded') return <CheckCircle2 size={16} className="text-green-500 mx-auto" strokeWidth={3} />;
                                                if (status === 'Pending') return <Clock size={16} className="text-orange-500 mx-auto" strokeWidth={3} />;
                                                return <XCircle size={16} className="text-red-500 mx-auto" strokeWidth={3} />;
                                            };

                                            return (
                                                <React.Fragment key={sub.id}>
                                                    <tr className={`hover:bg-blue-50/30 transition-colors group cursor-pointer ${isExpanded ? 'bg-blue-50/20' : ''}`} onClick={() => toggleRow(sub.id)}>
                                                        <td className="p-4 px-6">
                                                            <div className="font-bold text-gray-900 flex items-center gap-2">
                                                                {sub.name}
                                                                {requiresAttention && (progressPct < 50 || sub.status === 'Rejected') && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 px-3 text-center">{getIcon(sub.lessonPlan)}</td>
                                                        <td className="p-4 px-3 text-center">{getIcon(sub.notes)}</td>
                                                        <td className="p-4 px-3 text-center">{getIcon(sub.logbook)}</td>
                                                        <td className="p-4 px-3 text-center">{getIcon(sub.iatMarks)}</td>
                                                        <td className="p-4 px-6 text-center">
                                                            <span className={`text-xs font-black px-2 py-0.5 rounded-md ${progressPct === 100 ? 'text-green-700 bg-green-50' : progressPct >= 50 ? 'text-orange-700 bg-orange-50' : 'text-red-700 bg-red-50'}`}>
                                                                {progressPct}%
                                                            </span>
                                                        </td>
                                                        <td className="p-4 px-6 text-center">
                                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border inline-block ${
                                                                sub.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                                                sub.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                                                'bg-orange-50 text-orange-700 border-orange-200'
                                                            }`}>
                                                                {sub.status === 'Pending Approval' ? 'Pending' : sub.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 px-6 text-right">
                                                            <div className="flex justify-end gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                                                                {sub.status !== 'Approved' && sub.status !== 'Rejected' && (
                                                                    <>
                                                                        <button onClick={(e) => { e.stopPropagation(); handleApproveClick(sub.id); }} className="text-[10px] font-bold text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-lg transition shadow-sm uppercase">Approve</button>
                                                                        <button onClick={(e) => { e.stopPropagation(); handleRejectClick(sub.id); }} className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 px-3 py-1.5 rounded-lg transition shadow-sm uppercase">Reject</button>
                                                                    </>
                                                                )}
                                                                <button onClick={() => toggleRow(sub.id)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                                                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    {/* Expandable Detail View */}
                                                    {isExpanded && (
                                                        <tr className="bg-gray-50/50">
                                                            <td colSpan={8} className="p-0 border-b border-gray-100">
                                                                <div className="p-6 border-l-4 border-blue-500 mx-6 my-4 bg-white rounded-xl shadow-sm border-t border-r border-b">
                                                                    <div className="flex flex-col md:flex-row gap-8 items-start mb-6">
                                                                        <div className="flex-1">
                                                                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Faculty Profile</h4>
                                                                            <p className="font-extrabold text-gray-900">{sub.name}</p>
                                                                            <p className="text-sm font-medium text-gray-500">{sub.designation}</p>
                                                                            <div className="mt-2 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg inline-block border border-blue-100">{sub.email}</div>
                                                                        </div>
                                                                        
                                                                        <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
                                                                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Detailed Status Breakdown</h4>
                                                                            <div className="flex flex-col gap-3">
                                                                                {[
                                                                                    { label: 'Lesson Plan', status: sub.lessonPlan },
                                                                                    { label: 'Notes', status: sub.notes },
                                                                                    { label: 'Logbook', status: sub.logbook },
                                                                                    { label: 'IAT Marks', status: sub.iatMarks },
                                                                                ].map((item, idx) => (
                                                                                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl bg-gray-50/50 border border-gray-100 hover:bg-white transition-colors gap-2">
                                                                                        <div className="flex items-center gap-3">
                                                                                            <span className="text-xs font-bold text-gray-500 min-w-[100px]">{item.label}:</span>
                                                                                            <span className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${item.status === 'Uploaded' ? 'text-green-700 bg-green-50' : 'text-orange-700 bg-orange-50'}`}>
                                                                                                {item.status}
                                                                                            </span>
                                                                                        </div>
                                                                                        {item.status === 'Uploaded' && (
                                                                                            <button 
                                                                                                onClick={(e) => { e.stopPropagation(); window.open('#', '_blank'); }} 
                                                                                                className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50/50 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-all shadow-sm"
                                                                                            >
                                                                                                <Eye size={12} strokeWidth={3} /> View File
                                                                                            </button>
                                                                                        )}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div>
                                                                        <div className="flex items-center justify-between mb-2">
                                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Overall Completion</span>
                                                                            <span className={`text-sm font-black ${progressPct === 100 ? 'text-green-600' : progressPct >= 50 ? 'text-orange-500' : 'text-red-500'}`}>{progressPct}%</span>
                                                                        </div>
                                                                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden shadow-inner flex">
                                                                            <div className={`h-full ${progressPct === 100 ? 'bg-green-500' : progressPct >= 50 ? 'bg-orange-500' : 'bg-red-500'} transition-all duration-500`} style={{ width: `${progressPct}%` }}></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                            <p className="text-xs font-bold text-gray-500">
                                Showing <span className="text-gray-900">{paginatedSubmissions.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="text-gray-900">{Math.min(currentPage * itemsPerPage, filteredSubmissions.length)}</span> of <span className="text-gray-900">{filteredSubmissions.length}</span> entries
                            </p>
                            <div className="flex gap-2">
                                <button 
                                    disabled={currentPage === 1} 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    className="px-3 py-1.5 text-xs font-bold bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Previous
                                </button>
                                <button 
                                    disabled={currentPage === totalPages || totalPages === 0} 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    className="px-3 py-1.5 text-xs font-bold bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Pending Lesson Plans */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                            <h2 className="text-lg font-extrabold text-gray-800 flex items-center gap-3">
                                <ClipboardList className="text-blue-600" size={20} />
                                Pending Lesson Plans
                            </h2>
                        </div>
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-left table-auto">
                                <thead className="bg-white border-b border-gray-100 border-t">
                                    <tr>
                                        <th className="p-4 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Subject & Faculty</th>
                                        <th className="p-4 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Uploaded Date</th>
                                        <th className="p-4 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="p-4 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {lessonPlans.map((lp, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition">
                                            <td className="p-4 px-6">
                                                <div className="font-bold text-gray-900 text-sm">{lp.subject}</div>
                                                <div className="text-xs text-gray-500 font-medium mt-0.5">{lp.faculty}</div>
                                            </td>
                                            <td className="p-4 px-6 text-sm font-semibold text-gray-600">{lp.date}</td>
                                            <td className="p-4 px-6">
                                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase border tracking-widest ${lp.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    lp.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                                        'bg-orange-50 text-orange-700 border-orange-200'
                                                    }`}>
                                                    {lp.status}
                                                </span>
                                            </td>
                                            <td className="p-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View"><Eye size={16} /></button>
                                                    {isHOD && lp.status === 'Pending Approval' && (
                                                        <>
                                                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Approve"><CheckCircle2 size={16} /></button>
                                                            <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Reject"><XCircle size={16} /></button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Academic Alerts */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
                            <h3 className="font-extrabold text-gray-900 flex items-center gap-2">
                                <Bell size={18} className="text-gray-400" /> Academic Alerts
                            </h3>
                            <span className="bg-red-100 text-red-700 text-[10px] font-black tracking-widest px-2 py-1 rounded-lg">3 NEW</span>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
                            {academicAlerts.map((alert, i) => (
                                <div key={i} className="flex-1 flex flex-col gap-3 group cursor-default p-4 border border-gray-100 rounded-xl hover:shadow-md transition bg-gray-50/50">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-2.5 rounded-xl ${alert.bg} ${alert.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                            <alert.icon size={18} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800 mb-0.5">{alert.title}</p>
                                            <p className="text-xs font-medium text-gray-500 leading-tight">{alert.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Approval Confirmation Modal */}
            {approvalModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 border border-gray-100 transform transition-all">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border border-blue-100">
                            <CheckCircle size={32} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl font-extrabold text-gray-900 text-center mb-2">Confirm Approval</h3>
                        <p className="text-sm font-medium text-gray-500 text-center mb-8 leading-relaxed">
                            Are you sure you want to approve this academic submission? The faculty progress score will be permanently updated.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setApprovalModalOpen(false)}
                                className="flex-1 text-sm font-bold text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 py-3 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmApproval}
                                className="flex-1 text-sm font-bold text-white bg-blue-600 border border-transparent hover:bg-blue-700 py-3 rounded-xl shadow-md shadow-blue-500/20 transition-all"
                            >
                                Yes, Approve
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
