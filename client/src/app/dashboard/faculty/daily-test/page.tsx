"use client";
import React from 'react';
import { ClipboardList, Upload, Save, Calendar, Users, Target, FileSpreadsheet } from 'lucide-react';

export default function DailyTest() {
    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Daily Test Management</h1>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Upload test details and performance records</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
                    <ClipboardList size={20} className="text-blue-600" />
                    Enter Test Details
                </h3>
                
                <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Subject</label>
                        <select className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm bg-gray-50">
                            <option>Data Structures</option>
                            <option>DBMS</option>
                            <option>Operating Systems</option>
                        </select>
                    </div>
                    <div className="lg:col-span-2 space-y-2">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Test Topic</label>
                        <input type="text" placeholder="e.g. Binary Search Trees" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Date of Test</label>
                        <div className="relative">
                            <input type="date" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Total Students Appeared</label>
                        <input type="number" placeholder="60" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Average Score (%)</label>
                        <input type="number" placeholder="85" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" />
                    </div>
                    
                    <div className="md:col-span-3 space-y-2">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Upload Marks File</label>
                        <div className="border-2 border-dashed border-gray-100 rounded-2xl p-10 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition cursor-pointer group">
                            <FileSpreadsheet size={32} className="text-gray-300 mb-2 group-hover:text-teal-500 transition" />
                            <p className="text-sm font-bold text-gray-500">Excel or CSV file</p>
                            <span className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-widest">Download Template</span>
                        </div>
                    </div>

                    <div className="md:col-span-3 flex justify-end gap-4">
                        <button className="flex items-center gap-2 px-10 py-4 bg-teal-600 text-white rounded-2xl shadow-xl shadow-teal-500/30 hover:bg-teal-700 transition font-black uppercase text-xs tracking-widest">
                            <Save size={16} />
                            Save Test Details
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
