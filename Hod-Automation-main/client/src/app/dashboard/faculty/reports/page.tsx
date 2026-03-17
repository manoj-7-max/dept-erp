"use client";
import React from 'react';
import { BarChart, FileText, Download, CheckCircle2, Search, Filter, PieChart, TrendingUp } from 'lucide-react';

export default function FacultyReports() {
    const reportTypes = [
        { name: 'Attendance Report', icon: CheckCircle2, description: 'Detailed class-wise student attendance records', color: 'bg-green-50 text-green-600' },
        { name: 'Student Marks Report', icon: FileText, description: 'Internal and daily test performance summary', color: 'bg-blue-50 text-blue-600' },
        { name: 'Academic Progress', icon: TrendingUp, description: 'Syllabus completion and logbook statistics', color: 'bg-purple-50 text-purple-600' },
    ];

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Academic Reports</h1>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Generate and download performance and progress reports</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {reportTypes.map((report, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${report.color}`}>
                            <report.icon size={24} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition">{report.name}</h3>
                        <p className="text-sm font-medium text-gray-500 mt-1">{report.description}</p>
                        <button className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition">
                            <Download size={14} strokeWidth={3} />
                            Generate Report
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black text-gray-900">Custom Report Generator</h3>
                </div>
                
                <form className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Select Report</label>
                        <select className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm bg-gray-50">
                            <option>Marks Distribution</option>
                            <option>Attendance Deficiency</option>
                            <option>Subject Performance</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Subject</label>
                        <select className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm bg-gray-50">
                            <option>All Subjects</option>
                            <option>Data Structures</option>
                            <option>DBMS</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Year / Sec</label>
                        <select className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm bg-gray-50">
                            <option>2nd Year A</option>
                            <option>3rd Year B</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button className="w-full py-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition font-black uppercase text-[10px] tracking-widest">
                            Run Analysis
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
