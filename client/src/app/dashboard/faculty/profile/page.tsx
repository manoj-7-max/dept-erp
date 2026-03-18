"use client";
import React from 'react';
import { User, Mail, Briefcase, GraduationCap, Award, BookOpen, Clock, Save } from 'lucide-react';

export default function FacultyProfile() {
    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Faculty Profile</h1>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Personal and Professional Information</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 flex items-center justify-center text-white text-4xl font-black shadow-xl ring-4 ring-white">
                        A
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-1">Prof. Anitha</h2>
                    <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-6">Assistant Professor</p>
                    
                    <div className="w-full space-y-4 mb-8">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <Mail size={18} className="text-gray-400" />
                            <span className="text-sm font-semibold text-gray-700">anitha@college.edu</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <Briefcase size={18} className="text-gray-400" />
                            <span className="text-sm font-semibold text-gray-700">CSE Department</span>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-4">
                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                            <User size={20} className="text-blue-600" />
                            General Information
                        </h3>
                    </div>
                    
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Faculty Name</label>
                            <input type="text" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" defaultValue="Prof. Anitha" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Email Address</label>
                            <input type="email" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" defaultValue="anitha@college.edu" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Designation</label>
                            <input type="text" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" defaultValue="Assistant Professor" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Department</label>
                            <input type="text" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" defaultValue="CSE" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Subjects Handling</label>
                            <input type="text" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" defaultValue="Data Structures, DBMS, Operating Systems" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Experience</label>
                            <input type="text" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" defaultValue="8 Years" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Qualification</label>
                            <input type="text" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" defaultValue="M.E., Ph.D." />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Research Area</label>
                            <input type="text" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" defaultValue="Machine Learning, Cloud Computing" />
                        </div>

                        <div className="md:col-span-2 flex justify-end mt-4">
                            <button className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition font-black uppercase text-xs tracking-widest">
                                <Save size={16} />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
