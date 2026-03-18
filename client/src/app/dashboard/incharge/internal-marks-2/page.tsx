"use client";
import React from 'react';
import { Target, FileSpreadsheet, Save, Download, AlertCircle, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function InchargeInternalMarks2() {
    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight text-indigo-800">Internal Marks - IAT 2</h1>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Official IAT-2 marks recording for your class</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Average Score</p>
                            <h3 className="text-2xl font-black text-gray-900">76.8 / 100</h3>
                        </div>
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pass %</p>
                            <h3 className="text-2xl font-black text-green-600">92%</h3>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <CheckCircle2 size={20} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Failures</p>
                            <h3 className="text-2xl font-black text-red-600">04 Students</h3>
                        </div>
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                            <AlertCircle size={20} />
                        </div>
                    </div>
                </div>

                {/* Upload Context */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                            <FileSpreadsheet size={20} className="text-indigo-600" />
                            Bulk Upload
                        </h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Select Subject</label>
                                <select className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm bg-gray-50">
                                    <option>Theory of Computation</option>
                                    <option>Computer Networks</option>
                                    <option>Software Engineering</option>
                                </select>
                            </div>
                            <div className="border-2 border-dashed border-indigo-50 rounded-3xl p-10 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-white hover:border-indigo-200 transition cursor-pointer group">
                                <Target size={32} className="text-gray-300 mb-2 group-hover:text-indigo-500 transition" />
                                <p className="text-xs font-bold text-gray-400">Click to upload marksheet</p>
                            </div>
                            <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition font-black uppercase text-xs tracking-widest">
                                Submit Marks
                            </button>
                            <button className="w-full py-3 border-2 border-dashed border-gray-100 text-gray-400 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:border-gray-300 hover:text-gray-600 transition">
                                <Download size={14} className="inline mr-2" />
                                Download Template
                            </button>
                        </div>
                    </div>
                </div>

                {/* Verification List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-black text-gray-900">Marks Verification</h3>
                        </div>
                        <div className="p-4">
                            <div className="flex bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4 items-center gap-4">
                                <AlertCircle size={20} className="text-orange-500" />
                                <p className="text-xs font-bold text-gray-600 leading-relaxed">Please ensure all entries are cross-verified with the physical answer sheets before final submission.</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="p-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Reg No</th>
                                            <th className="p-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                                            <th className="p-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Marks</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {[1, 2, 3].map((i) => (
                                            <tr key={i}>
                                                <td className="p-4 text-xs font-bold text-gray-500">21152110400{i}</td>
                                                <td className="p-4 text-sm font-black text-gray-900">Student Name {i}</td>
                                                <td className="p-4 text-center">
                                                    <input type="number" placeholder="0" className="w-16 p-2 rounded-lg border border-gray-100 focus:border-indigo-500 outline-none font-bold text-sm text-center" />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 flex justify-end">
                            <button className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition font-black uppercase text-xs tracking-widest">
                                <Save size={16} />
                                Finalize Marks
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
