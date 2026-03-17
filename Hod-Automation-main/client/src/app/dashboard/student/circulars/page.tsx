"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Circular {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
    postedBy: { name: string };
}

export default function StudentCirculars() {
    const { token } = useAuth();
    const [circulars, setCirculars] = useState<Circular[]>([]);

    useEffect(() => {
        if (token) {
            fetch('http://localhost:5000/api/portal/circulars', {
                headers: { 'x-auth-token': token }
            })
                .then(res => res.json())
                .then(data => setCirculars(data))
                .catch(err => console.error(err));
        }
    }, [token]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Notice Board</h1>

            <div className="grid gap-4">
                {circulars.map((c) => (
                    <div key={c._id} className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-blue-500 border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{c.title}</h3>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {new Date(c.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-gray-600 mb-3">{c.content}</p>
                        <div className="text-xs text-gray-400">
                            Posted by: <span className="font-medium text-gray-600">{c.postedBy?.name || 'HOD Office'}</span>
                        </div>
                    </div>
                ))}

                {circulars.length === 0 && (
                    <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500">No new notices at this time.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
