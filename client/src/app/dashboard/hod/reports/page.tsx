"use client";
import { FileText, Users, GraduationCap, Download, BarChart2, BookOpen, UserCheck, Briefcase } from 'lucide-react';

export default function Reports() {
    return (
        <div className="py-6 max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Department Reports</h1>
                <p className="text-gray-500 font-medium mt-1">
                    Comprehensive overview providing academic, faculty, and placement analytics.
                </p>
            </div>

            {/* Academic Reports Section */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <BookOpen size={22} className="text-blue-600" /> Academic Reports
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Attendance Report</h3>
                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Monthly Analysis</p>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm mb-6 flex-grow">
                            Comprehensive summary of student attendance across all academic years and sections.
                        </p>
                        <div className="bg-gray-50 py-3 px-4 rounded-xl mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500 uppercase">Avg Attendance</span>
                                <span className="text-sm font-black text-gray-900">89.4%</span>
                            </div>
                        </div>
                        <button className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors">
                            <Download size={18} /> Download PDF
                        </button>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                <BarChart2 size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Internal Marks</h3>
                                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Assessment Stats</p>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm mb-6 flex-grow">
                            Detailed internal evaluation scores and continuous assessment performance metrics.
                        </p>
                        <div className="bg-gray-50 py-3 px-4 rounded-xl mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500 uppercase">Pass Percentage</span>
                                <span className="text-sm font-black text-gray-900">92.1%</span>
                            </div>
                        </div>
                        <button className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
                            <Download size={18} /> Download Excel
                        </button>
                    </div>
                </div>
            </div>

            {/* Faculty Reports Section */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <Users size={22} className="text-purple-600" /> Faculty Reports
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                <UserCheck size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Performance Index</h3>
                                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Activity Metrics</p>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm mb-6 flex-grow">
                            Consolidated faculty performance including research output, attendance, and duties.
                        </p>
                        <div className="bg-gray-50 py-3 px-4 rounded-xl mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-500 uppercase">Total Publications</span>
                                <span className="text-sm font-black text-gray-900">42</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500 uppercase">Feedback Avg</span>
                                <span className="text-sm font-black text-gray-900">4.6/5.0</span>
                            </div>
                        </div>
                        <button className="w-full flex justify-center items-center gap-2 bg-purple-600 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-purple-700 transition-colors">
                            <Download size={18} /> Download PDF
                        </button>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                <GraduationCap size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Research & Grants</h3>
                                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">R&D Output</p>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm mb-6 flex-grow">
                            Detailed report on ongoing research projects, funded grants, and patent filings.
                        </p>
                        <div className="bg-gray-50 py-3 px-4 rounded-xl mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500 uppercase">Active Grants</span>
                                <span className="text-sm font-black text-gray-900">₹12.5L</span>
                            </div>
                        </div>
                        <button className="w-full flex justify-center items-center gap-2 bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors">
                            <Download size={18} /> Download Excel
                        </button>
                    </div>
                </div>
            </div>

            {/* Placement Reports Section */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <Briefcase size={22} className="text-orange-600" /> Placement Reports
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Placement Stats</h3>
                                <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider">2024-2025</p>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm mb-6 flex-grow">
                            Comprehensive recruitment data, company visits, and student placement rates.
                        </p>
                        <div className="bg-gray-50 py-3 px-4 rounded-xl mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-500 uppercase">Students Placed</span>
                                <span className="text-sm font-black text-gray-900">145</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500 uppercase">Highest Package</span>
                                <span className="text-sm font-black text-gray-900">24 LPA</span>
                            </div>
                        </div>
                        <button className="w-full flex justify-center items-center gap-2 bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-orange-700 transition-colors">
                            <BarChart2 size={18} /> View Analytics
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
