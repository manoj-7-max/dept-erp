"use client";
import React from 'react';
import { LayoutDashboard, Users, BarChart2, TrendingUp, Search, Download, FileText, ChevronRight } from 'lucide-react';

export default function InchargeAcademicRecords() {
    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight text-blue-800">Class Performance Overview</h1>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Comprehensive academic records and analytics for your entire class</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition font-black uppercase text-xs tracking-widest">
                    <Download size={16} strokeWidth={3} />
                    Export Full Record
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
                {/* Stats */}
                {[
                    { label: 'Overall Class Pass %', value: '86%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Top Performer CGPA', value: '9.82', icon: BarChart2, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Avg. SGPAs 1-3', value: '8.4', icon: LayoutDashboard, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Arrear Students', value: '04', icon: Users, color: 'text-red-600', bg: 'bg-red-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className={`text-2xl font-black ${stat.color}`}>{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/10">
                    <h3 className="text-xl font-black text-gray-900">Student wise Consolidation</h3>
                    <div className="relative">
                        <input type="text" placeholder="Filter by Name/Reg No..." className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-xs bg-white w-64 transition shadow-sm" />
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/30 border-b border-gray-100">
                            <tr>
                                <th className="p-4 px-8 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Reg No</th>
                                <th className="p-4 px-8 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Name</th>
                                <th className="p-4 px-8 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center">Avg marks</th>
                                <th className="p-4 px-8 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center">Attendance %</th>
                                <th className="p-4 px-8 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[1, 2, 3].map((i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition cursor-pointer group">
                                    <td className="p-4 px-8 text-xs font-bold text-gray-500">21152110400{i}</td>
                                    <td className="p-4 px-8 text-sm font-black text-gray-900 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-[10px]">
                                            S{i}
                                        </div>
                                        Student Name {i}
                                    </td>
                                    <td className="p-4 px-8 text-center text-sm font-black text-gray-700">84.2</td>
                                    <td className="p-4 px-8 text-center">
                                        <div className="flex items-center gap-2 justify-center">
                                            <div className="w-16 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-green-500 h-full" style={{ width: '88%' }}></div>
                                            </div>
                                            <span className="text-[10px] font-black text-gray-500">88%</span>
                                        </div>
                                    </td>
                                    <td className="p-4 px-8 text-center">
                                        <button className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-blue-600 group-hover:bg-blue-50 transition">
                                            <ChevronRight size={18} />
                                        </button>
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
