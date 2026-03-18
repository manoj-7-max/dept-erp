"use client";
import React from 'react';
import { BookCopy, Link as LinkIcon, Plus, Save, Upload, Search, Globe, Award } from 'lucide-react';

export default function ResearchPapers() {
    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Research Publications</h1>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Add and manage your academic publications and research work</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition font-black uppercase text-xs tracking-widest">
                    <Plus size={16} strokeWidth={3} />
                    Add Paper
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
                    <BookCopy size={20} className="text-blue-600" />
                    Publication Details
                </h3>
                
                <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Paper Title</label>
                        <input type="text" placeholder="e.g. Optimized Resource Allocation in Hybrid Cloud" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Journal / Conference Name</label>
                        <input type="text" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Year of Publication</label>
                        <input type="number" placeholder="2024" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Scopus Indexed</label>
                        <select className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm bg-gray-50">
                            <option>Yes</option>
                            <option>No</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">DOI Link</label>
                        <div className="relative">
                            <input type="text" placeholder="https://doi.org/..." className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" />
                            <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                    
                    <div className="md:col-span-3 space-y-2">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Upload Proof (PDF)</label>
                        <div className="border-2 border-dashed border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-white hover:border-blue-200 transition cursor-pointer group">
                            <Upload size={32} className="text-gray-300 mb-2 group-hover:text-blue-500 transition" />
                            <p className="text-sm font-bold text-gray-500">Upload paper or certification</p>
                        </div>
                    </div>

                    <div className="md:col-span-3 flex justify-end">
                        <button className="flex items-center gap-2 px-10 py-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 transition font-black uppercase text-xs tracking-widest">
                            <Save size={16} />
                            Save Publication
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
