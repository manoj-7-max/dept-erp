"use client";
import React, { useState } from 'react';
import { Target, FileText, CheckCircle2, AlertCircle, Save, Upload, User, LayoutGrid, List } from 'lucide-react';

export default function InternalAssessment() {
    const [activeTab, setActiveTab] = useState<'iat1' | 'iat2'>('iat1');

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Internal Assessment</h1>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Upload marks and verify student performance for IATs</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-white p-1 rounded-2xl border border-gray-200 w-fit mb-8 shadow-sm">
                <button 
                    onClick={() => setActiveTab('iat1')}
                    className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition ${activeTab === 'iat1' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Internal Assessment 1 (IAT-1)
                </button>
                <button 
                    onClick={() => setActiveTab('iat2')}
                    className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition ${activeTab === 'iat2' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Internal Assessment 2 (IAT-2)
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Entry Form */}
                <div className="xl:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-8">
                        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                            <Target size={20} className="text-blue-600" />
                            Single Entry
                        </h3>
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Register Number</label>
                                <input type="text" placeholder="e.g. 211521104001" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Marks (Max 100)</label>
                                <input type="number" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Attendance</label>
                                <div className="flex gap-4">
                                    <label className="flex-1 flex items-center justify-center p-3 rounded-xl border border-gray-200 cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 has-[:checked]:text-blue-700 font-bold transition">
                                        <input type="radio" name="status" className="hidden" defaultChecked />
                                        <span>Present</span>
                                    </label>
                                    <label className="flex-1 flex items-center justify-center p-3 rounded-xl border border-gray-200 cursor-pointer has-[:checked]:bg-red-50 has-[:checked]:border-red-500 has-[:checked]:text-red-700 font-bold transition">
                                        <input type="radio" name="status" className="hidden" />
                                        <span>Absent</span>
                                    </label>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition font-black uppercase text-xs tracking-widest">
                                Save Entry
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bulk Upload & List */}
                <div className="xl:col-span-3 space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-gray-900">Bulk Marks Upload</h3>
                            <button className="text-xs font-bold text-blue-600 hover:underline">Download CSV Template</button>
                        </div>
                        <div className="border-2 border-dashed border-gray-100 rounded-3xl p-12 flex flex-col items-center justify-center bg-gray-50/50 group transition hover:bg-gray-50 hover:border-blue-200 cursor-pointer">
                            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition">
                                <Upload size={28} />
                            </div>
                            <p className="text-sm font-bold text-gray-600">Drag and drop your marksheet here</p>
                            <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mt-2 italic">Supports XLSX, CSV up to 5MB</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="text-lg font-black text-gray-900">Statistical Overview</h3>
                            <div className="flex gap-4">
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Average Marks</p>
                                    <p className="text-xl font-black text-blue-600">82.4</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pass Percentage</p>
                                    <p className="text-xl font-black text-green-600">94%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
