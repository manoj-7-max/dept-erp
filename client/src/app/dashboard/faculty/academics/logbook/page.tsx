"use client";
import React from 'react';
import { BookCopy, Calendar, Clock, CheckCircle2, Save, Plus } from 'lucide-react';

export default function Logbook() {
    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Logbook</h1>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Record daily class activities and progress</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition font-black uppercase text-xs tracking-widest">
                    <Plus size={16} strokeWidth={3} />
                    New Entry
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                    <BookCopy size={20} className="text-blue-600" />
                    Daily Class Entry
                </h3>
                
                <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Date</label>
                        <input type="date" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm bg-gray-50" />
                    </div>
                    <div className="space-y-2 lg:col-span-2">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Subject</label>
                        <select className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm bg-gray-50">
                            <option>Data Structures (2nd Year A)</option>
                            <option>DBMS (3rd Year B)</option>
                            <option>Operating Systems (3rd Year A)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Class Taken (Hours)</label>
                        <input type="number" placeholder="e.g. 2" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" />
                    </div>
                    <div className="md:col-span-4 space-y-2">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Topic Covered</label>
                        <input type="text" placeholder="Explain the topics discussed in class..." className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" />
                    </div>
                    <div className="md:col-span-4 space-y-2">
                        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Remarks / Observations</label>
                        <textarea placeholder="Any student issues, laboratory requirements, or special notes..." rows={3} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm"></textarea>
                    </div>

                    <div className="md:col-span-4 flex justify-end">
                        <button className="flex items-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition font-black uppercase text-xs tracking-widest">
                            <Save size={16} />
                            Save Logbook Entry
                        </button>
                    </div>
                </form>
            </div>
            
            {/* Recent Entries Table or List could go here */}
        </div>
    );
}
