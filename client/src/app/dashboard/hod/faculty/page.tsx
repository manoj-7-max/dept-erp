"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Faculty {
    _id: string;
    name: string;
    email: string;
    designation: string;
    isDoctorate: boolean;
}

export default function FacultyManagement() {
    const { token } = useAuth();
    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', designation: '', isDoctorate: false });

    // Realistic Faculty data
    const sampleFaculty = [
        { _id: '1', name: 'Ms. G. Vinitha', email: 'g.vinitha@kvcet.edu', designation: 'Assistant Professor', isDoctorate: false },
        { _id: '2', name: 'Ms. K. Vani Shree', email: 'k.vanishree@kvcet.edu', designation: 'Assistant Professor', isDoctorate: false },
        { _id: '3', name: 'Ms. S. Gayathri', email: 's.gayathri@kvcet.edu', designation: 'Assistant Professor', isDoctorate: false },
        { _id: '4', name: 'Dr. V. S. Thiyagarajan', email: 'v.s.thiyagarajan@kvcet.edu', designation: 'Professor', isDoctorate: true },
        { _id: '5', name: 'Ms. M. Muthuselvi', email: 'm.muthuselvi@kvcet.edu', designation: 'Assistant Professor', isDoctorate: false },
        { _id: '6', name: 'Ms. Usha Devi', email: 'ushadevi@kvcet.edu', designation: 'Assistant Professor', isDoctorate: false },
        { _id: '7', name: 'Ms. Bhuviya', email: 'bhuviya@kvcet.edu', designation: 'Trainer', isDoctorate: false },
    ];

    useEffect(() => {
        if (token) {
            fetch('http://localhost:5002/api/hod/faculty', {
                headers: { 'x-auth-token': token }
            })
                .then(res => res.json())
                .then(data => {
                    if (data && data.length > 0) setFaculty(data);
                    else setFaculty(sampleFaculty);
                })
                .catch(err => {
                    console.error(err);
                    setFaculty(sampleFaculty);
                });
        }
    }, [token]);

    const handleEdit = (fac: Faculty) => {
        setEditingId(fac._id);
        setFormData({ name: fac.name, designation: fac.designation, isDoctorate: fac.isDoctorate });
    };

    const handleSave = async (id: string) => {
        try {
            const res = await fetch(`http://localhost:5002/api/hod/faculty/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token || ''
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                const updatedFac = await res.json();
                setFaculty(faculty.map(f => f._id === id ? updatedFac : f));
                setEditingId(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure?')) {
            try {
                const res = await fetch(`http://localhost:5002/api/hod/faculty/${id}`, {
                    method: 'DELETE',
                    headers: { 'x-auth-token': token || '' }
                });
                if (res.ok) {
                    setFaculty(faculty.filter(f => f._id !== id));
                }
            } catch (err) {
                console.error(err);
            }
        }
    }

    return (
        <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Manage Faculty</h1>

            <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Designation</th>
                                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Doctorate</th>
                                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {faculty.map((fac) => (
                                <tr key={fac._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                                        {editingId === fac._id ? (
                                            <input
                                                className="border border-gray-300 p-1.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-normal w-full"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        ) : (
                                            <Link href={`/dashboard/hod/faculty/${fac._id}`} className="text-blue-600 hover:text-blue-800 hover:underline font-bold transition-colors">
                                                {fac.name}
                                            </Link>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                        {fac.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                                        {editingId === fac._id ? (
                                            <input
                                                className="border border-gray-300 p-1.5 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-normal w-full"
                                                value={formData.designation}
                                                onChange={e => setFormData({ ...formData, designation: e.target.value })}
                                            />
                                        ) : fac.designation}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                                        {editingId === fac._id ? (
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                                checked={formData.isDoctorate}
                                                onChange={e => setFormData({ ...formData, isDoctorate: e.target.checked })}
                                            />
                                        ) : (
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${fac.isDoctorate ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                                                {fac.isDoctorate ? 'Yes' : 'No'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                                        {editingId === fac._id ? (
                                            <button onClick={() => handleSave(fac._id)} className="inline-flex items-center px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-md font-medium transition-colors border border-green-200">
                                                Save
                                            </button>
                                        ) : (
                                            <button onClick={() => handleEdit(fac)} className="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md font-medium transition-colors border border-blue-200">
                                                Edit
                                            </button>
                                        )}
                                        <button onClick={() => handleDelete(fac._id)} className="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-md font-medium transition-colors border border-red-200">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {faculty.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                                        No faculty members found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
