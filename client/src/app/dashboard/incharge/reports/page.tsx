"use client";
import React from 'react';
import { BarChart, FileText, Download, CheckCircle2, TrendingUp, Search, PieChart } from 'lucide-react';

export default function InchargeReports() {
    const classReports = [
        { name: 'Class Attendance Consolidation', icon: CheckCircle2, description: 'Download attendance for the whole semester', color: 'bg-green-50 text-green-600' },
        { name: 'Subject-wise Performance', icon: BarChart, description: 'Analyze marks across all subjects in the class', color: 'bg-blue-50 text-blue-600' },
        { name: 'Student Academic History', icon: FileText, description: 'Export full academic profile of students', color: 'bg-purple-50 text-purple-600' },
        { name: 'Arrear & Failure Analytics', icon: TrendingUp, description: 'Detailed breakdown of student backlog status', color: 'bg-red-50 text-red-600' },
    ];

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight text-blue-800">Class Reports & Analytics</h1>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Download official documentation and analyze class performance</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {classReports.map((report, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer group">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${report.color}`}>
                            <report.icon size={28} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 leading-tight group-hover:text-blue-600 transition">{report.name}</h3>
                        <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-wide leading-relaxed">
                            {report.description}
                        </p>
                        <button className="mt-8 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all font-black text-[10px] uppercase tracking-widest">
                            <Download size={16} strokeWidth={3} />
                            Generate
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-10 border-b border-gray-50 pb-6">
                    <h3 className="text-xl font-black text-gray-900">Custom Analytics Generator</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Filter and export data</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Analysis Type</label>
                        <select className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50/30 focus:bg-white focus:border-blue-100 outline-none font-bold text-xs transition">
                            <option>Marks Distribution</option>
                            <option>Attendance Consistency</option>
                            <option>Subject Failure Rates</option>
                        </select>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Student Group</label>
                        <select className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50/30 focus:bg-white focus:border-blue-100 outline-none font-bold text-xs transition">
                            <option>All Students</option>
                            <option>&gt; 9.0 CGPA</option>
                            <option>&lt; 6.0 CGPA</option>
                            <option>Critical Attendance</option>
                        </select>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Format</label>
                        <select className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50/30 focus:bg-white focus:border-blue-100 outline-none font-bold text-xs transition">
                            <option>PDF Document</option>
                            <option>Excel Stylesheet</option>
                            <option>JSON Raw Data</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button className="w-full py-4 bg-gray-900 text-white rounded-2xl shadow-xl shadow-gray-400/10 hover:bg-slate-800 transition font-black uppercase text-xs tracking-[0.2em]">
                            Run Engine
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
