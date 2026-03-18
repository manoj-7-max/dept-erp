"use client";
import React from 'react';
import { MessageSquare, AlertCircle, Send, Upload, Info } from 'lucide-react';

export default function FacultyComplaint() {
    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight text-red-600">Register Complaint</h1>
                    <p className="text-gray-500 mt-1 font-medium text-sm italic">Report infrastructure, technical, or administrative issues</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-50 text-red-500">
                                <AlertCircle size={24} />
                            </div>
                            New Grievance Request
                        </h3>
                        
                        <form className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Complaint Category</label>
                                    <select className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-red-200 focus:ring-4 focus:ring-red-500/5 outline-none font-bold text-sm transition">
                                        <option>Lab Equipment Issue</option>
                                        <option>Network / Wi-Fi Problem</option>
                                        <option>Infrastructure (Classroom/Furniture)</option>
                                        <option>Administrative Issue</option>
                                        <option>Other / Specified</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Urgency Level</label>
                                    <div className="flex gap-4">
                                        {['Low', 'Medium', 'Critical'].map((level) => (
                                            <label key={level} className="flex-1 flex items-center justify-center p-3 rounded-2xl border-2 border-gray-50 cursor-pointer has-[:checked]:border-red-500 has-[:checked]:bg-red-50 has-[:checked]:text-red-700 font-black text-xs uppercase tracking-widest transition hover:border-gray-200">
                                                <input type="radio" name="priority" value={level} className="hidden" defaultChecked={level === 'Medium'} />
                                                {level}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Detailed Description</label>
                                <textarea rows={5} placeholder="Explain the issue in detail..." className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-red-200 focus:ring-4 focus:ring-red-500/5 outline-none font-bold text-sm transition resize-none"></textarea>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1">Attach Evidence (Optional)</label>
                                <div className="border-2 border-dashed border-gray-100 rounded-3xl p-10 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-white hover:border-red-100 transition cursor-pointer group">
                                    <Upload size={32} className="text-gray-300 mb-2 group-hover:text-red-400 transition" />
                                    <p className="text-sm font-bold text-gray-400">Upload photos or screenshots</p>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button className="flex items-center gap-3 px-10 py-5 bg-red-600 text-white rounded-2xl shadow-xl shadow-red-500/25 hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] transition font-black uppercase text-xs tracking-[0.2em]">
                                    <Send size={18} strokeWidth={3} />
                                    Submit Complaint
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20">
                        <div className="flex items-center gap-3 mb-6">
                            <Info size={24} strokeWidth={3} />
                            <h4 className="text-lg font-black uppercase tracking-widest">Important Note</h4>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-sm font-bold text-blue-100 leading-relaxed">
                                <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0"></div>
                                All complaints are strictly monitored by the HOD and Administrative staff.
                            </li>
                            <li className="flex gap-3 text-sm font-bold text-blue-100 leading-relaxed">
                                <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0"></div>
                                False reporting may lead to administrative inquiries.
                            </li>
                            <li className="flex gap-3 text-sm font-bold text-blue-100 leading-relaxed">
                                <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0"></div>
                                Track status of your complaints in the 'Reports' section.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
