"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function StaffComplaints() {
    const { token, user } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        staffId: 'FAC00' + Math.floor(Math.random() * 9 + 1), // Auto-fill mock
        name: user?.name || '',
        department: user?.department || 'CSE',
        designation: 'Assistant Professor',
        title: '',
        category: 'Infrastructure',
        priority: 'Medium',
        location: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    const [complaints, setComplaints] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'NEW' | 'TRACK'>('NEW');

    useEffect(() => {
        if (token) fetchMyComplaints();
    }, [token, activeTab]);

    const fetchMyComplaints = () => {
        fetch('http://localhost:5002/api/portal/complaints', {
            headers: { 'x-auth-token': token || '' }
        })
            .then(res => res.json())
            .then(data => setComplaints(data))
            .catch(err => console.error(err));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5002/api/portal/complaint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token || '' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Complaint submitted successfully!');
                setFormData({ ...formData, title: '', location: '', description: '' });
                setActiveTab('TRACK');
            }
        } catch (err) {
            console.error(err);
            alert('Error submitting complaint');
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Staff Complaint Portal</h1>
            <p className="text-gray-500 mb-8">Submit and track administrative, academic, or infrastructural issues.</p>

            {/* Toggle Tabs */}
            <div className="flex gap-4 border-b border-gray-200 mb-8 pb-2">
                <button
                    onClick={() => setActiveTab('NEW')}
                    className={`font-semibold pb-2 border-b-2 transition-colors px-2
                        ${activeTab === 'NEW' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                >
                    Submit New Complaint
                </button>
                <button
                    onClick={() => setActiveTab('TRACK')}
                    className={`font-semibold pb-2 border-b-2 transition-colors px-2
                        ${activeTab === 'TRACK' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                >
                    Track Complaints
                </button>
            </div>

            {activeTab === 'NEW' && (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Staff Details Section */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Staff Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Staff ID</label>
                                    <input type="text" className="w-full border p-2.5 rounded-lg bg-gray-50" value={formData.staffId} onChange={e => setFormData({ ...formData, staffId: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Staff Name</label>
                                    <input type="text" className="w-full border p-2.5 rounded-lg bg-gray-50" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                                    <select className="w-full border p-2.5 rounded-lg bg-gray-50" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                                        <option value="CSE">CSE</option>
                                        <option value="ECE">ECE</option>
                                        <option value="MECH">MECH</option>
                                        <option value="EEE">EEE</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
                                    <select className="w-full border p-2.5 rounded-lg bg-gray-50" value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })}>
                                        <option value="Assistant Professor">Assistant Professor</option>
                                        <option value="Associate Professor">Associate Professor</option>
                                        <option value="Lab Assistant">Lab Assistant</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Complaint Details Section */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Complaint Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Complaint Title</label>
                                    <input type="text" className="w-full border focus:ring-2 focus:ring-blue-500 outline-none p-2.5 rounded-lg" placeholder="Short description of the issue" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Complaint Category</label>
                                    <select className="w-full border focus:ring-2 focus:ring-blue-500 outline-none p-2.5 rounded-lg" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                        <option value="Infrastructure">Infrastructure</option>
                                        <option value="Lab Equipment">Lab Equipment</option>
                                        <option value="Network/IT Issue">Network/IT Issue</option>
                                        <option value="Timetable Issue">Timetable Issue</option>
                                        <option value="Student Discipline">Student Discipline</option>
                                        <option value="Administrative Issue">Administrative Issue</option>
                                        <option value="Research Related">Research Related</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Priority Level</label>
                                    <select className="w-full border focus:ring-2 focus:ring-blue-500 outline-none p-2.5 rounded-lg" value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Urgent">Urgent</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Location / Affected Area</label>
                                    <input type="text" className="w-full border focus:ring-2 focus:ring-blue-500 outline-none p-2.5 rounded-lg" placeholder="e.g. Block A, Room 402" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Complaint</label>
                                    <input type="date" className="w-full border focus:ring-2 focus:ring-blue-500 outline-none p-2.5 rounded-lg bg-gray-50" value={formData.date} disabled />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Complaint Description</label>
                                <textarea className="w-full border focus:ring-2 focus:ring-blue-500 outline-none p-3 rounded-lg h-32" placeholder="Provide complete details regarding the complaint..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Supporting Evidence (Optional)</label>
                                <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow">
                                Submit Complaint
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === 'TRACK' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="min-w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Complaint ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Priority</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {complaints.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 font-medium">No complaints submitted yet.</td>
                                </tr>
                            ) : complaints.map((c) => (
                                <tr key={c._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-sm text-gray-600">#{c._id.toUpperCase()}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">{c.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{c.category}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${c.priority === 'Urgent' || c.priority === 'High' ? 'bg-red-100 text-red-700' :
                                                c.priority === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                            }`}>{c.priority}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(c.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${c.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' :
                                                c.status === 'Under Review' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    c.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                                        'bg-gray-100 text-gray-700 border-gray-200'
                                            }`}>{c.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
