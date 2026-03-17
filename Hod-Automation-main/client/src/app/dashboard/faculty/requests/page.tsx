"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Request {
    _id: string;
    title: string;
    description: string;
    type: string;
    status: string;
    submittedBy: { name: string, role: string, department: string };
    createdAt: string;
}

export default function FacultyVerificationRequests() {
    const { token } = useAuth();
    const [requests, setRequests] = useState<Request[]>([]);

    useEffect(() => {
        if (token) {
            fetch('http://localhost:5000/api/faculty/requests/pending', {
                headers: { 'x-auth-token': token }
            })
                .then(res => res.json())
                .then(data => setRequests(data))
                .catch(err => console.error(err));
        }
    }, [token]);

    const handleVerify = async (id: string, status: 'VERIFIED' | 'REJECTED') => {
        try {
            const res = await fetch(`http://localhost:5000/api/faculty/request/${id}/verify`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token || ''
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setRequests(requests.filter(r => r._id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Pending Verifications</h1>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {requests.map((req) => (
                            <tr key={req._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                        {req.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{req.submittedBy?.name}</div>
                                    <div className="text-sm text-gray-500">{req.submittedBy?.department}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{req.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(req.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => handleVerify(req._id, 'VERIFIED')}
                                        className="text-blue-600 hover:text-blue-900 font-bold"
                                    >
                                        Verify & Forward
                                    </button>
                                    <button
                                        onClick={() => handleVerify(req._id, 'REJECTED')}
                                        className="text-red-600 hover:text-red-900 font-bold"
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {requests.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No pending requests for verification</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
