"use client";
import React from 'react';
import { UploadCloud, FileText, CheckCircle2, Trash2, Search, Filter } from 'lucide-react';

export default function NotesUpload() {
    const recentUploads = [
        { subject: 'Data Structures', unit: 'Unit 1', filename: 'Stacks_and_Queues.pdf', date: '2024-03-12', size: '2.4 MB' },
        { subject: 'DBMS', unit: 'Unit 3', filename: 'SQL_Joins_Advanced.ppt', date: '2024-03-10', size: '5.1 MB' },
    ];

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Study Material</h1>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Upload and manage subject notes for students</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Upload Section */}
                <div className="xl:col-span-1 space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                            <UploadCloud size={20} className="text-blue-600" />
                            New Upload
                        </h3>
                        <form className="space-y-6">
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
                                <select className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm bg-gray-50">
                                    <option>Unit I</option>
                                    <option>Unit II</option>
                                    <option>Unit III</option>
                                    <option>Unit IV</option>
                                    <option>Unit V</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Upload File</label>
                                <div className="border-2 border-dashed border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-white hover:border-blue-200 transition">
                                    <FileText size={24} className="text-gray-300 mb-2" />
                                    <p className="text-xs font-bold text-gray-400">PDF, PPT, DOCX</p>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition font-black uppercase text-xs tracking-widest">
                                Upload Material
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="text-lg font-black text-gray-900">Recent Uploads</h3>
                            <div className="flex gap-2">
                                <button className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-blue-600 transition">
                                    <Search size={18} />
                                </button>
                                <button className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-blue-600 transition">
                                    <Filter size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="p-2">
                            {recentUploads.map((upload, i) => (
                                <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-gray-900">{upload.filename}</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                {upload.subject} &bull; {upload.unit} &bull; {upload.size}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right mr-4">
                                            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Uploaded</p>
                                            <p className="text-xs font-bold text-gray-700">{upload.date}</p>
                                        </div>
                                        <button className="p-2 text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                                            <Trash2 size={18} />
                                        </button>
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
