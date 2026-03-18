"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    Megaphone,
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    Search,
    Filter,
    Upload,
    Calendar,
    Eye,
    Edit,
    Trash2,
    Download
} from 'lucide-react';

interface Circular {
    _id: string;
    title: string;
    content: string;
    audience: string;
    priority: string;
    status: string;
    publishDate: string;
    expiryDate: string;
    attachment?: string;
    createdAt: string;
}

export default function CircularsManagement() {
    const { token } = useAuth();
    const [circulars, setCirculars] = useState<Circular[]>([]);

    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [audience, setAudience] = useState('ALL');
    const [priority, setPriority] = useState('Medium');
    const [publishDate, setPublishDate] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [fileName, setFileName] = useState('');

    // Filter & Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState('ALL');
    const [filterAudience, setFilterAudience] = useState('ALL');

    useEffect(() => {
        if (token) fetchCirculars();
    }, [token]);

    // Mock Stats Data (To be replaced with dynamic data in real implementation)
    const stats = [
        { label: 'Total Circulars', count: 124, icon: Megaphone, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Circulars', count: 18, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Expired Circulars', count: 102, icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100' },
        { label: 'Draft Circulars', count: 4, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    // Priority color mapping
    const getPriorityColor = (p: string) => {
        switch (p.toUpperCase()) {
            case 'URGENT': return 'bg-red-50 text-red-700 border-red-200';
            case 'HIGH': return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'MEDIUM': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'LOW': return 'bg-gray-50 text-gray-700 border-gray-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    // Status color mapping
    const getStatusColor = (s: string) => {
        switch (s.toUpperCase()) {
            case 'ACTIVE': return 'bg-green-50 text-green-700 border-green-200';
            case 'EXPIRED': return 'bg-gray-50 text-gray-600 border-gray-200';
            case 'DRAFT': return 'bg-orange-50 text-orange-700 border-orange-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const fetchCirculars = async () => {
        // MOCK DATA: Replacing fetch for initial UI building phase since schema isn't fully updated yet.
        const mockCirculars: Circular[] = [
            { _id: '1', title: 'End Semester Examination Schedule', content: 'The final schedule for the upcoming Even Semester examinations is attached.', audience: 'STUDENT', priority: 'High', status: 'Active', publishDate: '2023-11-01', expiryDate: '2023-12-15', attachment: 'exam_schedule.pdf', createdAt: '2023-10-30T10:00:00Z' },
            { _id: '2', title: 'Faculty Development Program - AI Integration', content: 'Mandatory FDP for all department faculty focusing on AI syllabus integration.', audience: 'FACULTY', priority: 'Urgent', status: 'Active', publishDate: '2023-11-05', expiryDate: '2023-11-20', createdAt: '2023-11-02T14:30:00Z' },
            { _id: '3', title: 'Campus Holiday Notice - Diwali', content: 'The college will remain closed from 10th to 14th November.', audience: 'ALL', priority: 'Medium', status: 'Expired', publishDate: '2023-11-08', expiryDate: '2023-11-15', createdAt: '2023-11-06T09:15:00Z' },
            { _id: '4', title: 'Call for Papers - International Conference', content: 'Students and Faculty are encouraged to submit papers for the upcoming ICCS 2024.', audience: 'ALL', priority: 'Low', status: 'Active', publishDate: '2023-10-15', expiryDate: '2024-01-31', attachment: 'cfp_guidelines.pdf', createdAt: '2023-10-10T11:45:00Z' },
            { _id: '5', title: '3rd Year Mini-Project Reviews', content: 'Schedule for the upcoming mini-project review zero.', audience: '3RD_YEAR', priority: 'High', status: 'Draft', publishDate: '2023-11-20', expiryDate: '2023-11-25', createdAt: '2023-11-18T16:00:00Z' },
        ];
        setCirculars(mockCirculars);

        // try {
        //     const res = await fetch('http://localhost:5002/api/portal/circulars', {
        //         headers: { 'x-auth-token': token || '' }
        //     });
        //     const data = await res.json();
        //     setCirculars(data);
        // } catch (err) {
        //     console.error(err);
        // }
    };

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        alert('Circular formulation complete. Ready for API integration with new payload structure.');
        // try {
        //     const res = await fetch('http://localhost:5002/api/portal/circular', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'x-auth-token': token || ''
        //         },
        //         body: JSON.stringify({ title, content, audience, priority, publishDate, expiryDate, isPublic: audience === 'ALL' })
        //     });
        //     if (res.ok) {
        //         setTitle('');
        //         setContent('');
        //         setAudience('ALL');
        //         setPriority('Medium');
        //         setPublishDate('');
        //         setExpiryDate('');
        //         setFileName('');
        //         fetchCirculars();
        //         alert('Circular Posted Successfully');
        //     }
        // } catch (err) {
        //     console.error(err);
        // }
    };

    // Apply filters
    const filteredCirculars = circulars.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = filterPriority === 'ALL' || c.priority.toUpperCase() === filterPriority;
        const matchesAudience = filterAudience === 'ALL' || c.audience === filterAudience;
        return matchesSearch && matchesPriority && matchesAudience;
    });

    return (
        <div className="max-w-7xl mx-auto py-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Circulars & Announcements</h1>
                    <p className="text-gray-500 mt-1">Manage and track departmental communications.</p>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} strokeWidth={2} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500">{stat.label}</p>
                            <p className="text-2xl font-black text-gray-900 mt-0.5">{stat.count}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Post Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
                        <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                            <Megaphone className="text-blue-600" size={20} />
                            Compose Circular
                        </h2>

                        <form onSubmit={handlePost} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Subject Title</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm placeholder-gray-400 font-medium"
                                    placeholder="Enter circular title..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Audience</label>
                                    <select
                                        className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium cursor-pointer"
                                        value={audience}
                                        onChange={(e) => setAudience(e.target.value)}
                                    >
                                        <option value="ALL">Everyone Public</option>
                                        <option value="FACULTY">Faculty Only</option>
                                        <option value="STUDENT">All Students</option>
                                        <option value="1ST_YEAR">1st Years</option>
                                        <option value="2ND_YEAR">2nd Years</option>
                                        <option value="3RD_YEAR">3rd Years</option>
                                        <option value="4TH_YEAR">4th Years</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Priority</label>
                                    <select
                                        className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium cursor-pointer"
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Publish Date</label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium text-gray-700"
                                        value={publishDate}
                                        onChange={(e) => setPublishDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Expiry Date</label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium text-gray-700"
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Message Content</label>
                                <textarea
                                    className="w-full border border-gray-200 p-3 rounded-xl h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm placeholder-gray-400 font-medium resize-none"
                                    placeholder="Write the announcement details here..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Attachment (Optional)</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition cursor-pointer relative">
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                                        accept=".pdf,.doc,.docx"
                                    />
                                    <Upload className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                                    {fileName ? (
                                        <p className="text-sm font-bold text-blue-600 truncate px-2">{fileName}</p>
                                    ) : (
                                        <>
                                            <p className="text-sm font-bold text-gray-600">Click to upload file</p>
                                            <p className="text-xs font-medium text-gray-400 mt-1">PDF, DOC, DOCX up to 5MB</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                                <Megaphone size={18} />
                                Broadcast Circular
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Filters & Table */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Search & Filter Bar */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search circulars by keyword..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-4">
                            <select
                                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                            >
                                <option value="ALL">All Priorities</option>
                                <option value="URGENT">Urgent</option>
                                <option value="HIGH">High</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="LOW">Low</option>
                            </select>
                            <select
                                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                                value={filterAudience}
                                onChange={(e) => setFilterAudience(e.target.value)}
                            >
                                <option value="ALL">All Audiences</option>
                                <option value="STUDENT">Students</option>
                                <option value="FACULTY">Faculty</option>
                            </select>
                        </div>
                    </div>

                    {/* Circulars Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                            <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                                <FileText className="text-gray-500" size={20} />
                                Circular History
                            </h2>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{filteredCirculars.length} Records found</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white border-b border-gray-100 border-t">
                                    <tr>
                                        <th className="p-4 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Date & Status</th>
                                        <th className="p-4 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Circular Details</th>
                                        <th className="p-4 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider text-center">Audience</th>
                                        <th className="p-4 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider text-center">Priority</th>
                                        <th className="p-4 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredCirculars.map((c) => (
                                        <tr key={c._id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="p-4 px-6">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <Calendar size={14} className="text-gray-400" />
                                                    <span className="text-sm font-bold text-gray-700">{c.publishDate || new Date(c.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <span className={`inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest rounded border ${getStatusColor(c.status)}`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="p-4 px-6">
                                                <p className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{c.title}</p>
                                                <p className="text-xs font-medium text-gray-500 line-clamp-1">{c.content}</p>
                                                {c.attachment && (
                                                    <div className="inline-flex items-center gap-1.5 mt-2 bg-blue-50 text-blue-700 px-2 py-1 rounded text-[10px] font-bold border border-blue-100">
                                                        <Download size={12} /> {c.attachment}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 px-6 text-center">
                                                <span className="px-2.5 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-md text-[10px] font-extrabold uppercase tracking-widest">
                                                    {c.audience.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="p-4 px-6 text-center">
                                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest border ${getPriorityColor(c.priority)}`}>
                                                    {c.priority}
                                                </span>
                                            </td>
                                            <td className="p-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View"><Eye size={16} /></button>
                                                    <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition" title="Edit"><Edit size={16} /></button>
                                                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredCirculars.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center">
                                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-3">
                                                    <AlertCircle className="text-gray-400" size={24} />
                                                </div>
                                                <p className="text-gray-500 font-bold">No circulars matching your criteria</p>
                                                <p className="text-gray-400 text-sm font-medium mt-1">Try adjusting your search or filters.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
