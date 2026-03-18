"use client";
import React from 'react';
import { CalendarCheck, Users, Save, CheckCircle2, XCircle, Search, Filter, History } from 'lucide-react';

export default function InchargeAttendance() {
    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight text-blue-800">Class Attendance</h1>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Official attendance recording for your assigned class</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Status Bar */}
                <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Strength</p>
                            <h3 className="text-2xl font-black text-gray-900">60</h3>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Users size={20} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Present Today</p>
                            <h3 className="text-2xl font-black text-green-600">54</h3>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <CheckCircle2 size={20} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Absent Today</p>
                            <h3 className="text-2xl font-black text-red-600">06</h3>
                        </div>
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                            <XCircle size={20} />
                        </div>
                    </div>
                </div>

                {/* Entry Form */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <input type="date" className="p-2 rounded-lg border border-gray-200 text-xs font-bold font-sans outline-none focus:ring-2 focus:ring-blue-500 transition" defaultValue={new Date().toISOString().split('T')[0]} />
                                <div className="h-4 w-px bg-gray-200"></div>
                                <select className="p-2 rounded-lg border border-gray-200 text-xs font-bold font-sans outline-none focus:ring-2 focus:ring-blue-500 transition bg-transparent">
                                    <option>Section A (CSE)</option>
                                    <option>Section B (CSE)</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 rounded-lg bg-green-600 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-500/20 hover:bg-green-700 transition">Mark All Present</button>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-4 px-8 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest w-24">Reg No</th>
                                        <th className="p-4 px-8 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Student Name</th>
                                        <th className="p-4 px-8 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <tr key={i} className="hover:bg-gray-50/50 transition">
                                            <td className="p-4 px-8 text-xs font-bold text-gray-500">21152110400{i}</td>
                                            <td className="p-4 px-8 text-sm font-black text-gray-900">Student Name {i}</td>
                                            <td className="p-4 px-8 text-center">
                                                <div className="flex justify-center gap-3">
                                                    <label className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-gray-100 text-gray-300 cursor-pointer has-[:checked]:bg-green-500 has-[:checked]:border-green-500 has-[:checked]:text-white transition group hover:border-green-200">
                                                        <input type="radio" name={`att-${i}`} value="p" className="hidden" defaultChecked />
                                                        <span className="font-black text-xs">P</span>
                                                    </label>
                                                    <label className="flex items-center justify-center w-10 h-10 rounded-xl border-2 border-gray-100 text-gray-300 cursor-pointer has-[:checked]:bg-red-500 has-[:checked]:border-red-500 has-[:checked]:text-white transition group hover:border-red-200">
                                                        <input type="radio" name={`att-${i}`} value="a" className="hidden" />
                                                        <span className="font-black text-xs">A</span>
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button className="flex items-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition font-black uppercase text-xs tracking-[0.2em]">
                                <Save size={16} />
                                Submit Attendance
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar History/Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h4 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
                            <History size={16} className="text-blue-500" />
                            Recent History
                        </h4>
                        <div className="space-y-4">
                            {[ '2024-03-13', '2024-03-12', '2024-03-11' ].map((date) => (
                                <div key={date} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-700">{date}</span>
                                    <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase tracking-tighter">Verified</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
