"use client";
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, XCircle, Clock, Search, Check, X, ArrowLeft, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';

interface FacultyRequest {
    id: string;
    name: string;
    type: 'Leave' | 'On Duty (OD)' | 'Permission' | 'Purchase';
    description: string;
    date: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

export default function FacultyRequests() {
    const { token } = useAuth();
    const [requests, setRequests] = useState<FacultyRequest[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    const facultyRequests: FacultyRequest[] = [
        { 
            id: 'FAC001', 
            name: 'Dr. Subramani V', 
            type: 'Leave', 
            description: 'Medical leave for 2 days due to personal emergency.', 
            date: '2026-03-18', 
            status: 'Pending' 
        },
        { 
            id: 'FAC002', 
            name: 'Prof. Anitha R', 
            type: 'On Duty (OD)', 
            description: 'Attending International Conference on AI at Anna University.', 
            date: '2026-03-19', 
            status: 'Approved' 
        },
        { 
            id: 'FAC003', 
            name: 'Mr. Rajesh Kumar', 
            type: 'Permission', 
            description: 'Early exit permission for 2 hours for bank work.', 
            date: '2026-03-20', 
            status: 'Pending' 
        },
        { 
            id: 'FAC004', 
            name: 'Dr. Kavitha S', 
            type: 'Purchase', 
            description: 'Purchase of 10 new high-performance monitors for Lab 1.', 
            date: '2026-03-21', 
            status: 'Pending' 
        },
        { 
            id: 'FAC005', 
            name: 'Ms. Priya Dharshini', 
            type: 'Leave', 
            description: 'Casual leave for 1 day for family function.', 
            date: '2026-03-22', 
            status: 'Rejected' 
        },
        { 
            id: 'FAC006', 
            name: 'Mr. Vignesh W', 
            type: 'On Duty (OD)', 
            description: 'Valuation duty at COE, Kancheepuram.', 
            date: '2026-03-23', 
            status: 'Approved' 
        },
    ];

    useEffect(() => {
        setRequests(facultyRequests);
    }, []);

    const handleAction = (id: string, actionStatus: 'Approved' | 'Rejected') => {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status: actionStatus } : req));
    };

    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            const matchesSearch = req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                req.type.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === 'ALL' || req.status.toUpperCase() === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [requests, searchQuery, filterStatus]);

    const getTypeBadgeStyle = (type: string) => {
        switch (type) {
            case 'Leave': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'On Duty (OD)': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'Permission': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
            case 'Purchase': return 'bg-pink-50 text-pink-600 border-pink-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'Approved': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200"><CheckCircle2 size={12} /> Approved</span>;
            case 'Rejected': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200"><XCircle size={12} /> Rejected</span>;
            default: return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200"><Clock size={12} /> Pending</span>;
        }
    };

    return (
        <div className="py-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/hod/requests" className="p-2 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-gray-200 shadow-sm hover:shadow-md group">
                    <ArrowLeft size={24} className="text-gray-600 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Faculty Requests</h1>
                    <p className="text-gray-500 font-medium mt-1 uppercase text-xs tracking-widest bg-purple-50 text-purple-600 w-fit px-2 py-0.5 rounded-lg border border-purple-100 font-bold">Administrative Control</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transition-all hover:shadow-2xl hover:shadow-gray-300/50">
                <div className="p-8 border-b border-gray-100 bg-gray-50/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative max-w-md w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, ID or type..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all font-medium text-gray-700"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${
                                    filterStatus === status 
                                    ? 'bg-purple-600 text-white shadow-lg' 
                                    : 'bg-white text-gray-500 border border-gray-200 hover:border-purple-600 hover:text-purple-600'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Faculty Info</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Request Type</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Details</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Date</th>
                                <th className="px-8 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Status</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredRequests.map((req) => (
                                <tr key={req.id} className="group hover:bg-gray-50/80 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-gray-900">{req.name}</span>
                                            <span className="text-[10px] font-bold text-gray-400 mt-0.5">ID: {req.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getTypeBadgeStyle(req.type)}`}>
                                            {req.type}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-medium text-gray-500 max-w-xs">{req.description}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Calendar size={14} />
                                            <span className="text-xs font-bold">{req.date}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <StatusBadge status={req.status} />
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {req.status === 'Pending' ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleAction(req.id, 'Approved')}
                                                    className="w-10 h-10 flex items-center justify-center bg-green-50 text-green-600 rounded-xl border border-green-100 hover:bg-green-600 hover:text-white transition-all shadow-sm hover:shadow-green-200"
                                                    title="Approve"
                                                >
                                                    <Check size={18} strokeWidth={3} />
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(req.id, 'Rejected')}
                                                    className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 rounded-xl border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm hover:shadow-red-200"
                                                    title="Reject"
                                                >
                                                    <X size={18} strokeWidth={3} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Processed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredRequests.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="inline-flex p-6 bg-gray-50 rounded-[2rem] text-gray-300 mb-4 border border-gray-100 shadow-inner">
                            <FileText size={40} strokeWidth={1} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No faculty requests found</h3>
                        <p className="text-gray-500 font-medium">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
