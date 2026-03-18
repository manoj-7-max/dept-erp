"use client";
import React from 'react';
import { BookOpen, Plus, FileText, Calendar, Percent, Upload, Save } from 'lucide-react';

export default function LessonPlan() {
    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Lesson Plan</h1>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Design and track your subject curriculum</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition font-black uppercase text-xs tracking-widest">
                    <Plus size={16} strokeWidth={3} />
                    New Lesson Plan
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50">
                    <h3 className="text-xl font-black text-gray-900 mb-6">Create / Update Lesson Plan</h3>
                    
                    <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Subject</label>
                            <select className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm bg-gray-50">
                                <option>Data Structures</option>
                                <option>DBMS</option>
                                <option>Operating Systems</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Unit</label>
                            <input type="text" placeholder="e.g. Unit I" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Date</label>
                            <input type="date" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Topics Covered</label>
                            <textarea placeholder="List the topics for this session..." rows={3} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm"></textarea>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Completion Percentage</label>
                            <div className="relative">
                                <input type="number" placeholder="0" className="w-full p-3 pr-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" />
                                <Percent size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                        <div className="md:col-span-3 space-y-2">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Upload Syllabus/Plan</label>
                            <div className="border-2 border-dashed border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition cursor-pointer group">
                                <Upload size={32} className="text-gray-300 mb-2 group-hover:text-blue-500 transition" />
                                <p className="text-sm font-bold text-gray-500 group-hover:text-gray-700">Click to upload or drag and drop</p>
                                <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-wider italic">PDF, DOCX up to 10MB</p>
                            </div>
                        </div>

                        <div className="md:col-span-3 flex justify-end">
                            <button className="flex items-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition font-black uppercase text-xs tracking-widest">
                                <Save size={16} />
                                Save Lesson Plan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
