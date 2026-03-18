"use client";
import React, { useState } from 'react';

export default function FacultyUploads() {
    const [activeTab, setActiveTab] = useState('NOTE'); // NOTE, ASSIGNMENT

    return (
        <div className="p-8 bg-gray-50 min-h-screen text-gray-800 font-sans">
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Resource Management</h1>
                <p className="text-gray-500 mt-1 font-medium text-sm">Upload and manage course materials and assignments</p>
            </div>

            <div className="flex gap-2 border-b border-gray-200 mb-8">
                {['NOTE', 'ASSIGNMENT', 'LAB_MANUAL'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 px-5 font-bold text-sm transition-all border-b-2 ${activeTab === tab
                                ? 'border-blue-600 text-blue-700'
                                : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                            }`}
                    >
                        {tab.replace('_', ' ')}S
                    </button>
                ))}
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-50 pb-4">
                    Upload New {activeTab.replace('_', ' ')}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Title</label>
                        <input type="text" className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm font-semibold text-gray-800" placeholder="e.g. Unit 1 Notes" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Subject Code</label>
                        <input type="text" className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm font-semibold text-gray-800" placeholder="e.g. CS8602" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Year / Sem</label>
                        <div className="flex gap-4">
                            <select className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm font-semibold text-gray-800">
                                <option>I Year</option>
                                <option>II Year</option>
                                <option>III Year</option>
                                <option>IV Year</option>
                            </select>
                            <select className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm font-semibold text-gray-800">
                                <option>Sem 1</option>
                                <option>Sem 2</option>
                                <option>Sem 3</option>
                                <option>Sem 4</option>
                                <option>Sem 5</option>
                                <option>Sem 6</option>
                                <option>Sem 7</option>
                                <option>Sem 8</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">File URL (GDrive/Cloudinary)</label>
                        <input type="text" className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm font-semibold text-gray-800" placeholder="https://..." />
                    </div>
                </div>
                <button className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-sm hover:bg-blue-700 hover:shadow transition-all text-sm w-full md:w-auto">
                    Upload Resource
                </button>
            </div>

            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Uploads</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-5 flex justify-between items-center hover:bg-gray-50 transition">
                            <div>
                                <p className="font-bold text-gray-900 text-sm mb-1">Unit {i} Question Bank</p>
                                <p className="text-xs font-semibold text-gray-500">CS8602 - Compiler Design</p>
                            </div>
                            <button className="text-blue-600 text-xs font-bold bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition">View Details</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
