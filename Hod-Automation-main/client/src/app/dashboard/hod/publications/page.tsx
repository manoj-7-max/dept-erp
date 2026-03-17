"use client";
import React, { useState } from 'react';
import { BookCopy, CheckCircle, XCircle } from 'lucide-react';

export default function ResearchPublications() {
    const [publications, setPublications] = useState([
        {
            id: 1,
            facultyName: 'Dr. V. S. Thiyagarajan',
            title: 'Advanced Cryptography in Cloud Computing',
            journal: 'IEEE Transactions on Information Forensics',
            indexType: 'SCI',
            year: 2023,
            status: 'Pending'
        },
        {
            id: 2,
            facultyName: 'Ms. G. Vinitha',
            title: 'Machine Learning for Predictive Healthcare',
            journal: 'International Journal of Health Informatics',
            indexType: 'Scopus',
            year: 2023,
            status: 'Verified'
        },
        {
            id: 3,
            facultyName: 'Ms. K. Vani Shree',
            title: 'IoT Base Smart Agriculture Monitoring',
            journal: 'International Conference on IoT',
            indexType: 'Conference',
            year: 2024,
            status: 'Pending'
        }
    ]);

    const handleVerify = (id: number, newStatus: string) => {
        setPublications(publications.map(pub => pub.id === id ? { ...pub, status: newStatus } : pub));
    };

    return (
        <div className="py-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 rounded-xl">
                    <BookCopy className="text-blue-600" size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Research Publications</h1>
                    <p className="text-sm text-gray-500 font-medium">Monitor and verify faculty research activities and accreditations.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">Submitted Publications</h2>
                    <div className="flex gap-4 text-sm font-semibold">
                        <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Total: {publications.length}</span>
                        <span className="text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">Pending: {publications.filter(p => p.status === 'Pending').length}</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Faculty Name</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/4">Paper Title / Journal Name</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Index Type</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Year</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Verification Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {publications.map((pub) => (
                                <tr key={pub.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="font-bold text-gray-900">{pub.facultyName}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="font-bold text-gray-800 text-sm">{pub.title}</div>
                                        <div className="text-gray-500 text-xs mt-1 bg-gray-100 inline-block px-2 py-0.5 rounded-md">{pub.journal}</div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${pub.indexType === 'SCI' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                                                pub.indexType === 'Scopus' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' :
                                                    'bg-gray-100 text-gray-700 border border-gray-200'
                                            }`}>
                                            {pub.indexType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="text-gray-700 font-semibold">{pub.year}</div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${pub.status === 'Verified' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                pub.status === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                                                    'bg-orange-100 text-orange-700 border border-orange-200'
                                            }`}>
                                            {pub.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-center">
                                        {pub.status === 'Pending' ? (
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => handleVerify(pub.id, 'Verified')} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-xs transition-colors shadow-sm shadow-green-500/30">
                                                    <CheckCircle size={14} /> Approve
                                                </button>
                                                <button onClick={() => handleVerify(pub.id, 'Rejected')} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-bold text-xs transition-colors">
                                                    <XCircle size={14} /> Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-sm font-semibold italic">Action Taken</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
