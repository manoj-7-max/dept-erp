"use client";
import React from 'react';
import { Award, Plus, Save, Calendar, Globe, Star, Search, Filter } from 'lucide-react';

export default function InchargeCoCurricular() {
    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight text-teal-800">Co-Curricular Activities</h1>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Record student participation in events, symposiums, and sports</p>
                </div>
                <button className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-teal-500/30 hover:bg-teal-700 transition font-black uppercase text-xs tracking-widest">
                    <Plus size={16} strokeWidth={3} />
                    New Entry
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-8">
                        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                            <Award size={20} className="text-teal-600" />
                            Activity Entry
                        </h3>
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Reg No</label>
                                <input type="text" placeholder="211521104001" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none font-bold text-sm bg-gray-50/50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Event Name</label>
                                <input type="text" placeholder="e.g. CodeX Symposium" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none font-bold text-sm bg-gray-50/50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Level</label>
                                <select className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none font-bold text-sm bg-gray-50">
                                    <option>College Level</option>
                                    <option>Zonal Level</option>
                                    <option>State Level</option>
                                    <option>National Level</option>
                                    <option>International Level</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Position / Prize</label>
                                <input type="text" placeholder="e.g. 1st Place" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none font-bold text-sm bg-gray-50/50" />
                            </div>
                            <button className="w-full py-4 bg-teal-600 text-white rounded-2xl shadow-xl shadow-teal-500/20 hover:bg-teal-700 transition font-black uppercase text-xs tracking-widest">
                                Save Achievement
                            </button>
                        </form>
                    </div>
                </div>

                {/* Recent Achievements */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="text-lg font-black text-gray-900">Class Achievements</h3>
                            <div className="flex gap-2">
                                <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Search size={16} /></div>
                                <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Filter size={16} /></div>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-center gap-6 p-4 rounded-2xl border border-gray-50 bg-gray-50/30 group hover:border-teal-200 transition">
                                    <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 shadow-sm border border-amber-100">
                                        <Award size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-gray-900 leading-tight">National Level Hackathon</h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Student Name {i} &bull; 1st Runner Up</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase tracking-tighter">Verified</p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">March 2024</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
