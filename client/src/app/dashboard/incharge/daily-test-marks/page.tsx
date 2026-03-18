"use client";
import React from 'react';
import { CheckSquare, Upload, Save, Search, User, FileSpreadsheet, Download } from 'lucide-react';

export default function InchargeDailyTestMarks() {
    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight text-blue-800">Daily Test Marks</h1>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Upload and manage daily test scores for your class</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Upload Section */}
                <div className="xl:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                            <Upload size={20} className="text-blue-600" />
                            Bulk Upload
                        </h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Select Test</label>
                                <select className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm bg-gray-50">
                                    <option>Topic: Binary Trees (2024-03-14)</option>
                                    <option>Topic: SQL Joins (2024-03-12)</option>
                                </select>
                            </div>
                            <div className="border-2 border-dashed border-gray-100 rounded-3xl p-10 flex flex-col items-center justify-center bg-gray-50 group hover:border-blue-200 transition cursor-pointer">
                                <FileSpreadsheet size={32} className="text-gray-300 mb-2 group-hover:text-blue-500 transition" />
                                <p className="text-xs font-bold text-gray-400">Excel / CSV File</p>
                            </div>
                            <button className="w-full py-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition font-black uppercase text-xs tracking-widest">
                                Upload Marks
                            </button>
                            <button className="w-full py-3 border-2 border-gray-100 text-gray-400 rounded-2xl hover:text-gray-600 hover:border-gray-200 transition font-bold text-[10px] uppercase tracking-widest">
                                <Download size={14} className="inline mr-2" />
                                Download Student List
                            </button>
                        </div>
                    </div>
                </div>

                {/* Individual Entry Section */}
                <div className="xl:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="text-lg font-black text-gray-900">Manual Entry / Verification</h3>
                            <div className="relative group">
                                <input type="text" placeholder="Search Registration No..." className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-xs bg-gray-50 w-48 transition" />
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-4 px-8 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Reg No</th>
                                        <th className="p-4 px-8 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Name</th>
                                        <th className="p-4 px-8 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center w-32">Marks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {[1, 2, 3, 4].map((i) => (
                                        <tr key={i} className="hover:bg-gray-50/50 transition">
                                            <td className="p-4 px-8 text-xs font-bold text-gray-500">21152110400{i}</td>
                                            <td className="p-4 px-8 text-sm font-black text-gray-900">Student Name {i}</td>
                                            <td className="p-4 px-8 text-center">
                                                <input type="number" placeholder="80" className="w-20 text-center p-2 rounded-lg border border-gray-100 focus:border-blue-500 outline-none font-bold text-sm bg-gray-50/50" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-6 border-t border-gray-50 flex justify-end">
                            <button className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 transition font-black uppercase text-xs tracking-widest">
                                <Save size={16} />
                                Save Marks
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
