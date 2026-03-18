"use client";
import React from 'react';
import { TrendingUp, Award, AlertCircle } from 'lucide-react';

export default function FacultyPerformance() {
    const facultyPerformance = [
        {
            id: 1,
            name: 'Dr. V. S. Thiyagarajan',
            target: 3,
            achieved: 2,
        },
        {
            id: 2,
            name: 'Ms. G. Vinitha',
            target: 2,
            achieved: 2,
        },
        {
            id: 3,
            name: 'Ms. K. Vani Shree',
            target: 2,
            achieved: 1,
        },
        {
            id: 4,
            name: 'Ms. S. Gayathri',
            target: 2,
            achieved: 0,
        },
        {
            id: 5,
            name: 'Ms. M. Muthuselvi',
            target: 1,
            achieved: 1,
        }
    ];

    const getPerformanceDetails = (achieved: number, target: number) => {
        const score = target > 0 ? Math.round((achieved / target) * 100) : 0;
        let status = '';
        let statusColor = '';
        let barColor = '';

        if (score >= 100) {
            status = 'Exceptional';
            statusColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
            barColor = 'bg-emerald-500';
        } else if (score >= 75) {
            status = 'Good';
            statusColor = 'bg-blue-100 text-blue-800 border-blue-200';
            barColor = 'bg-blue-500';
        } else if (score >= 40) {
            status = 'Fair';
            statusColor = 'bg-yellow-100 text-yellow-800 border-yellow-200';
            barColor = 'bg-yellow-500';
        } else {
            status = 'Needs Improvement';
            statusColor = 'bg-red-100 text-red-800 border-red-200';
            barColor = 'bg-red-500';
        }

        return { score, status, statusColor, barColor };
    };

    return (
        <div className="py-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-indigo-100 rounded-xl">
                    <TrendingUp className="text-indigo-600" size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Faculty Performance Evaluation</h1>
                    <p className="text-sm text-gray-500 font-semibold mt-1">Track research productivity and progress toward accreditation targets.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-xl"><Award size={24} /></div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase">Top Performer</p>
                        <p className="text-lg font-extrabold text-gray-900">Ms. G. Vinitha</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><TrendingUp size={24} /></div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase">Average Completion</p>
                        <p className="text-xl font-black text-gray-900">63%</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-red-100 text-red-600 rounded-xl"><AlertCircle size={24} /></div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase">Attention Needed</p>
                        <p className="text-lg font-extrabold text-gray-900">1 Faculty Member</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                    <h2 className="text-lg font-extrabold text-gray-800">Department R&D Metrics</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-white">
                            <tr>
                                <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-50/50">Faculty Name</th>
                                <th scope="col" className="px-6 py-5 text-center text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-50/50">Target</th>
                                <th scope="col" className="px-6 py-5 text-center text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-50/50">Achieved</th>
                                <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-50/50 w-[30%]">Performance Score</th>
                                <th scope="col" className="px-6 py-5 text-center text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-50/50">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {facultyPerformance.map((fac) => {
                                const { score, status, statusColor, barColor } = getPerformanceDetails(fac.achieved, fac.target);

                                return (
                                    <tr key={fac.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <div className="font-extrabold text-gray-900">{fac.name}</div>
                                        </td>
                                        <td className="px-6 py-6 text-center whitespace-nowrap">
                                            <span className="font-black text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">{fac.target}</span>
                                        </td>
                                        <td className="px-6 py-6 text-center whitespace-nowrap">
                                            <span className="font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">{fac.achieved}</span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden shadow-inner flex-1">
                                                    <div className={`${barColor} h-3.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-all duration-1000 ease-out`} style={{ width: `${Math.min(score, 100)}%` }}></div>
                                                </div>
                                                <span className="font-black text-gray-800 min-w-[3rem] text-right">{score}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center whitespace-nowrap">
                                            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border ${statusColor}`}>
                                                {status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
