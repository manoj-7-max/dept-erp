"use client";
import React, { useState, useMemo } from 'react';
import { 
    ClipboardCheck, 
    Search, 
    Check, 
    X, 
    Calendar, 
    Filter, 
    BarChart3, 
    Clock, 
    CheckCircle2, 
    AlertCircle,
    ChevronRight,
    FilterX,
    Users,
    GraduationCap,
    ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UnifiedRequest {
    id: string;
    name: string;
    role: 'Student' | 'Faculty';
    type: 'Leave' | 'OD' | 'Bonafide' | 'Bus Pass' | 'Fee Extension' | 'Purchase' | 'Permission';
    description: string;
    date: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

export default function RequestManagementDashboard() {
    const [activeTab, setActiveTab] = useState<'STUDENT' | 'FACULTY'>('STUDENT');
    const [requests, setRequests] = useState<UnifiedRequest[]>([
        { id: 'REQ-001', name: 'Arjun Kumar', role: 'Student', type: 'Leave', description: 'Medical leave for 3 days due to severe fever.', date: '2026-03-15', status: 'Pending' },
        { id: 'REQ-002', name: 'Priya Sharma', role: 'Student', type: 'OD', description: 'Attending National Level Hackathon at IIT Madras.', date: '2026-03-14', status: 'Approved' },
        { id: 'REQ-003', name: 'Suresh Raina', role: 'Student', type: 'Bonafide', description: 'Requesting bonafide certificate for passport application.', date: '2026-03-13', status: 'Pending' },
        { id: 'FAC-001', name: 'Dr. Subramani V', role: 'Faculty', type: 'Leave', description: 'Medical leave for 2 days due to personal emergency.', date: '2026-03-18', status: 'Pending' },
        { id: 'FAC-002', name: 'Prof. Anitha R', role: 'Faculty', type: 'OD' as any, description: 'Attending International Conference on AI at Anna University.', date: '2026-03-19', status: 'Approved' },
        { id: 'FAC-004', name: 'Dr. Kavitha S', role: 'Faculty', type: 'Purchase', description: 'Purchase of 10 new high-performance monitors for Lab 1.', date: '2026-03-21', status: 'Pending' },
        { id: 'REQ-004', name: 'Ananya Vedam', role: 'Student', type: 'Bus Pass', description: 'Renewal of college bus pass for the even semester.', date: '2026-03-12', status: 'Approved' },
        { id: 'FAC-005', name: 'Ms. Priya Dharshini', role: 'Faculty', type: 'Leave', description: 'Casual leave for 1 day for family function.', date: '2026-03-22', status: 'Rejected' },
        { id: 'FAC-006', name: 'Mr. Vignesh W', role: 'Faculty', type: 'Permission', description: 'Valuation duty at COE, Kancheepuram.', date: '2026-03-23', status: 'Approved' },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [confirmAction, setConfirmAction] = useState<{id: string, action: 'Approved' | 'Rejected'} | null>(null);

    // Derived Stats based on active tab
    const stats = useMemo(() => {
        const tabRequests = requests.filter(r => r.role.toUpperCase() === activeTab);
        return {
            total: tabRequests.length,
            pending: tabRequests.filter(r => r.status === 'Pending').length,
            approved: tabRequests.filter(r => r.status === 'Approved').length,
            rejected: tabRequests.filter(r => r.status === 'Rejected').length
        };
    }, [requests, activeTab]);

    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            const matchesTab = req.role.toUpperCase() === activeTab;
            const matchesSearch = req.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                req.type.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === 'ALL' || req.status.toUpperCase() === filterStatus;
            return matchesTab && matchesSearch && matchesStatus;
        });
    }, [requests, searchQuery, filterStatus, activeTab]);

    const handleProcessAction = () => {
        if (!confirmAction) return;
        setRequests(prev => prev.map(req => 
            req.id === confirmAction.id ? { ...req, status: confirmAction.action } : req
        ));
        setConfirmAction(null);
    };

    const getTypeBadgeStyle = (type: string) => {
        switch (type) {
            case 'Leave': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'OD': case 'OD Request': case 'On Duty (OD)': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'Purchase': return 'bg-pink-50 text-pink-600 border-pink-100';
            case 'Permission': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
            case 'Bus Pass': return 'bg-orange-50 text-orange-600 border-orange-100';
            default: return 'bg-teal-50 text-teal-600 border-teal-100';
        }
    };

    return (
        <div className="py-2 max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 1. Split Header & Active Workflow Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl shadow-lg transition-all duration-500 ${activeTab === 'STUDENT' ? 'bg-blue-600 shadow-blue-200' : 'bg-purple-600 shadow-purple-200'}`}>
                            <ClipboardCheck size={28} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                            {activeTab === 'STUDENT' ? 'Student' : 'Faculty'} Requests
                        </h1>
                    </div>
                    <p className="text-gray-500 font-medium ml-1">Managing workflow for {activeTab.toLowerCase()} department records.</p>
                </div>

                {/* Tab Switcher - Visual Differentiation from Complaints */}
                <div className="bg-gray-100 p-1.5 rounded-[2rem] flex items-center shadow-inner self-start">
                    <button 
                        onClick={() => setActiveTab('STUDENT')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-[1.8rem] text-xs font-black tracking-widest uppercase transition-all ${
                            activeTab === 'STUDENT' 
                            ? 'bg-white text-blue-600 shadow-xl' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        <Users size={16} /> Students
                    </button>
                    <button 
                        onClick={() => setActiveTab('FACULTY')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-[1.8rem] text-xs font-black tracking-widest uppercase transition-all ${
                            activeTab === 'FACULTY' 
                            ? 'bg-white text-purple-600 shadow-xl' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        <GraduationCap size={16} /> Faculty
                    </button>
                </div>
            </div>

            {/* 2. Analytics Section (Tab Specific) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-2">
                {[
                    { label: 'Submissions', value: stats.total, color: activeTab === 'STUDENT' ? 'blue' : 'purple', icon: BarChart3 },
                    { label: 'Pending', value: stats.pending, color: 'blue', icon: Clock },
                    { label: 'Approved', value: stats.approved, color: 'green', icon: CheckCircle2 },
                    { label: 'Rejected', value: stats.rejected, color: 'red', icon: AlertCircle },
                ].map((stat, i) => (
                    <motion.div 
                        key={stat.label + activeTab}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center group hover:shadow-xl hover:shadow-gray-200/30 transition-all cursor-default relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 p-4 opacity-[0.03] transition-transform duration-700 group-hover:scale-150 group-hover:-rotate-12`}>
                            <stat.icon size={80} />
                        </div>
                        <div className={`p-2 rounded-xl mb-3 ${
                            stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                            stat.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                            stat.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        } group-hover:scale-110 transition-transform relative z-10`}>
                            <stat.icon size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 relative z-10">{stat.label}</span>
                        <span className="text-3xl font-black text-gray-900 relative z-10">{stat.value}</span>
                    </motion.div>
                ))}
            </div>

            {/* 3. Logic & Filtering Bar */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <Filter size={18} className={activeTab === 'STUDENT' ? 'text-blue-600' : 'text-purple-600'} />
                        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={`px-6 py-2.5 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all ${
                                    filterStatus === s 
                                    ? activeTab === 'STUDENT' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <div className="relative group max-w-sm w-full">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors ${activeTab === 'STUDENT' ? 'group-focus-within:text-blue-600' : 'group-focus-within:text-purple-600'}`} size={18} />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab.toLowerCase()} requests...`}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-opacity-10 transition-all font-bold text-gray-700 placeholder:text-gray-400 focus:bg-white"
                            style={{ '--tw-ring-color': activeTab === 'STUDENT' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(147, 51, 234, 0.1)' } as any}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* 4. Workflow Table */}
                <div className="overflow-x-auto rounded-[2rem] border border-gray-50 shadow-inner">
                    <table className="min-w-full divide-y divide-gray-50">
                        <thead>
                            <tr className="bg-gray-50/70">
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Application ID</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Requester</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Request Type</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Submission Date</th>
                                <th className="px-8 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50">
                            <AnimatePresence mode='popLayout'>
                                {filteredRequests.map((req, idx) => (
                                    <motion.tr 
                                        key={req.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                                        className="group hover:bg-gray-50/80 transition-all duration-300"
                                    >
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-black text-gray-900 tracking-tight">{req.id}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-gray-900 leading-tight">{req.name}</span>
                                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-0.5">{activeTab} ID: {req.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getTypeBadgeStyle(req.type)}`}>
                                                {req.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="opacity-50" />
                                                <span className="text-xs font-bold">{req.date}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                                                req.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                                req.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                                activeTab === 'STUDENT' ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm' : 'bg-purple-50 text-purple-700 border-purple-200 shadow-sm'
                                            }`}>
                                                {req.status === 'Approved' ? <CheckCircle2 size={12} strokeWidth={3} /> :
                                                 req.status === 'Rejected' ? <AlertCircle size={12} strokeWidth={3} /> :
                                                 <Clock size={12} strokeWidth={3} />}
                                                {req.status}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {req.status === 'Pending' ? (
                                                <div className="flex items-center justify-end gap-2 group-hover:scale-110 transition-transform">
                                                    <button 
                                                        onClick={() => setConfirmAction({id: req.id, action: 'Approved'})}
                                                        className="w-10 h-10 flex items-center justify-center bg-green-50 text-green-600 rounded-2xl border border-green-100 hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <Check size={20} strokeWidth={3} />
                                                    </button>
                                                    <button 
                                                        onClick={() => setConfirmAction({id: req.id, action: 'Rejected'})}
                                                        className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 rounded-2xl border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <X size={20} strokeWidth={3} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-gray-300 justify-end">
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Finalized</span>
                                                    <ArrowUpRight size={14} />
                                                </div>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {filteredRequests.length === 0 && (
                    <div className="p-24 text-center">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="inline-flex p-8 bg-gray-50 rounded-[3rem] text-gray-200 mb-6 border border-gray-100 shadow-inner"
                        >
                            <FilterX size={64} strokeWidth={1} />
                        </motion.div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">No match found</h3>
                        <p className="text-gray-500 font-medium">Clear filters or try a different search query for {activeTab.toLowerCase()} entries.</p>
                        <button 
                            onClick={() => { setSearchQuery(''); setFilterStatus('ALL'); }}
                            className={`mt-6 px-8 py-3 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-colors shadow-xl ${
                                activeTab === 'STUDENT' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-200'
                            }`}
                        >
                            Reset Active Filters
                        </button>
                    </div>
                )}
            </div>

            {/* 5. Action Confirmation Modal */}
            <AnimatePresence>
                {confirmAction && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[3rem] shadow-2xl max-w-md w-full overflow-hidden border border-white/20"
                        >
                            <div className={`h-2 ${confirmAction.action === 'Approved' ? 'bg-green-500' : 'bg-red-500'}`} />
                            <div className="p-10 text-center space-y-6">
                                <div className={`inline-flex p-5 rounded-[2rem] ${
                                    confirmAction.action === 'Approved' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                } shadow-inner`}>
                                    {confirmAction.action === 'Approved' ? <CheckCircle2 size={48} /> : <AlertCircle size={48} />}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                                        Execute Decision?
                                    </h3>
                                    <p className="text-gray-500 font-medium leading-relaxed">
                                        Are you sure you want to <strong>{confirmAction.action.toLowerCase()}</strong> request <strong>{confirmAction.id}</strong>?
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 pt-4">
                                    <button 
                                        onClick={() => setConfirmAction(null)}
                                        className="flex-1 px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleProcessAction}
                                        className={`flex-1 px-6 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl ${
                                            confirmAction.action === 'Approved' 
                                            ? 'bg-green-600 shadow-green-200 hover:bg-green-700' 
                                            : 'bg-red-600 shadow-red-200 hover:bg-red-700'
                                        }`}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
