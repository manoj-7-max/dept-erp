"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Filter, Eye, CheckCircle, XCircle } from 'lucide-react';

export default function HODComplaintDashboard() {
    const { token } = useAuth();
    const [complaints, setComplaints] = useState<any[]>([]);
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');
    const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        if (token) fetchComplaints();
    }, [token]);

    const fetchComplaints = () => {
        fetch('http://localhost:5002/api/portal/complaints', {
            headers: { 'x-auth-token': token || '' }
        })
        .then(res => res.json())
        .then(data => setComplaints(data))
        .catch(err => console.error(err));
    };

    const handleAction = async (id: string, status: string, comment?: string) => {
        try {
            const bodyData: any = { status };
            if (comment) bodyData.newComment = comment;

            const res = await fetch(`http://localhost:5002/api/portal/complaint/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token || '' },
                body: JSON.stringify(bodyData)
            });
            if (res.ok) {
                fetchComplaints();
                if (selectedComplaint && selectedComplaint._id === id) {
                    const updated = await res.json();
                    setSelectedComplaint(updated);
                    setCommentText(''); // Clear comment input
                }
            }
        } catch (err) { console.error(err); }
    };

    const filteredComplaints = complaints.filter(c => {
        // Exclude Student Feedback from the Staff Complaints page
        if (c.type === 'Student Feedback') return false;
        
        if (filterCategory !== 'All' && c.category !== filterCategory) return false;
        if (filterPriority !== 'All' && c.priority !== filterPriority) return false;
        return true;
    });

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">HOD Complaint Management</h1>
            <p className="text-gray-500 mb-8">Review, manage, and resolve staff and infrastructure complaints.</p>

            <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-center">
                <div className="flex items-center gap-2 text-gray-600 font-semibold mr-4">
                    <Filter size={20} /> Filters:
                </div>
                <select className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                    <option value="All">All Categories</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Lab Equipment">Lab Equipment</option>
                    <option value="Network/IT Issue">Network/IT Issue</option>
                    <option value="Timetable Issue">Timetable Issue</option>
                    <option value="Student Discipline">Student Discipline</option>
                    <option value="Administrative Issue">Administrative Issue</option>
                    <option value="Research Related">Research Related</option>
                </select>
                <select className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                    <option value="All">All Priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Complaints Table (Left 2/3) */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="min-w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Complaint</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Priority</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredComplaints.length === 0 && (
                                <tr><td colSpan={4} className="p-6 text-center text-gray-500">No complaints matching filter.</td></tr>
                            )}
                            {filteredComplaints.map(c => (
                                <tr key={c._id} className={`hover:bg-blue-50 transition cursor-pointer ${selectedComplaint?._id === c._id ? 'bg-blue-50' : ''}`} onClick={() => setSelectedComplaint(c)}>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-800">{c.title}</div>
                                        <div className="text-xs text-gray-500">{c.category} • By {c.name || c.submittedBy?.name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            c.priority === 'Urgent' || c.priority === 'High' ? 'text-red-600 bg-red-50' : 
                                            c.priority === 'Medium' ? 'text-orange-600 bg-orange-50' : 'text-green-600 bg-green-50'
                                        }`}>{c.priority}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-semibold text-xs py-1 px-3 rounded-full border ${
                                            c.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' :
                                            c.status === 'Under Review' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                            c.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                            'bg-gray-100 text-gray-700 border-gray-200'
                                        }`}>{c.status}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={(e) => { e.stopPropagation(); setSelectedComplaint(c); }} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold text-sm bg-blue-50 py-1 px-2 rounded">
                                            <Eye size={16} /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Complaint Details Panel (Right 1/3) */}
                <div className="lg:col-span-1">
                    {selectedComplaint ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-1 lg:max-w-full break-words">#{selectedComplaint._id.toUpperCase()} - {selectedComplaint.title}</h2>
                            <p className="text-sm text-gray-500 border-b pb-4 mb-4">Date: {new Date(selectedComplaint.createdAt).toLocaleDateString()}</p>
                            
                            <div className="space-y-4 mb-6">
                                <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Staff Name</p><p className="font-medium text-gray-800">{selectedComplaint.name || selectedComplaint.submittedBy?.name}</p></div>
                                <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Designation</p><p className="font-medium text-gray-800">{selectedComplaint.designation || 'Faculty Member'}</p></div>
                                <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Location</p><p className="font-medium text-gray-800">{selectedComplaint.location}</p></div>
                                <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Description</p><p className="text-gray-700 text-sm mt-1 bg-gray-50 p-3 rounded-lg">{selectedComplaint.description}</p></div>
                            </div>

                            {/* Comments Section */}
                            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-800 mb-3">HOD Comments</h3>
                                <div className="space-y-3 mb-4 max-h-32 overflow-y-auto">
                                    {(selectedComplaint.comments || []).length === 0 ? (
                                        <p className="text-xs text-gray-500 italic">No comments yet.</p>
                                    ) : (
                                        selectedComplaint.comments.map((cm: any, i: number) => (
                                            <div key={i} className="text-sm bg-white p-2 border rounded shadow-sm">
                                                <span className="font-bold text-blue-800 text-xs block mb-1">HOD • {new Date(cm.date).toLocaleDateString()}</span>
                                                <p className="text-gray-700 text-xs">{cm.text}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {selectedComplaint.status !== 'Resolved' && (
                                    <div className="flex gap-2">
                                        <input type="text" className="flex-1 text-sm border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Add a comment..." value={commentText} onChange={e => setCommentText(e.target.value)} />
                                        <button onClick={() => handleAction(selectedComplaint._id, selectedComplaint.status, commentText)} className="bg-gray-800 text-white px-3 py-1 rounded text-sm font-bold">Add</button>
                                    </div>
                                )}
                            </div>

                            {/* Actions Component */}
                            {selectedComplaint.status !== 'Resolved' && selectedComplaint.status !== 'Rejected' && (
                                <div className="border-t pt-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Actions</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {selectedComplaint.status === 'Pending' && (
                                            <button onClick={() => handleAction(selectedComplaint._id, 'Under Review')} className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold text-sm transition">Approve (Under Review)</button>
                                        )}
                                        <button onClick={() => handleAction(selectedComplaint._id, 'Resolved')} className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-1 py-2 rounded-lg font-bold text-sm transition"><CheckCircle size={16}/> Resolve</button>
                                        <button onClick={() => handleAction(selectedComplaint._id, 'Rejected')} className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-1 py-2 rounded-lg font-bold text-sm transition"><XCircle size={16}/> Reject</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500 sticky top-6">
                            <Eye size={48} className="mx-auto mb-4 text-gray-300" />
                            <p className="font-semibold text-lg">Select a complaint</p>
                            <p className="text-sm">Click 'View' on any complaint from the table to see details and take action.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
