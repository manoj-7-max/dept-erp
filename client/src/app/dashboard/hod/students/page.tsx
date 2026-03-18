"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Users, GraduationCap, CheckCircle } from 'lucide-react';

export default function ClassMonitoring() {
    // Generate mock classes for CSE (Years 2, 3, 4; Sections A, B)
    const years = [2, 3, 4];
    const sections = ['A', 'B'];

    const [selectedClass, setSelectedClass] = useState<{ year: number, section: string } | null>(null);

    // Mock data generator for dashboard overview
    const classData = years.flatMap(year =>
        sections.map(section => ({
            id: `${year}${section}`,
            year,
            section,
            facultyIncharge: `Prof. ${String.fromCharCode(65 + year + section.charCodeAt(0))}...`,
            totalStudents: 60,
            presentToday: Math.floor(Math.random() * 15) + 40, // Random 40-55
            topic: year === 2 ? 'Data Structures' : year === 3 ? 'Operating Systems' : 'Machine Learning',
            status: Math.random() > 0.8 ? 'Lab' : 'Lecture'
        }))
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Class Monitoring</h1>
                    <p className="text-gray-500 mt-1">CSE Department - Live Attendance & Status Overview</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {classData.map((cls) => {
                    const percentage = Math.round((cls.presentToday / cls.totalStudents) * 100);
                    return (
                        <Link href={`/dashboard/hod/students/${cls.id}`} key={cls.id} className="block">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition duration-200 h-full">
                                <div className="p-5 border-b border-gray-50 flex justify-between items-start bg-gradient-to-r from-blue-50 to-white">
                                    <div>
                                        <h3 className="text-xl font-bold text-blue-900">{cls.year}{cls.year === 2 ? 'nd' : cls.year === 3 ? 'rd' : 'th'} Year</h3>
                                        <p className="text-blue-600 font-bold uppercase tracking-wider text-sm mt-1">Section {cls.section}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${cls.status === 'Lab' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                                        {cls.status}
                                    </div>
                                </div>

                                <div className="p-5 space-y-4">
                                    <div className="flex items-center text-sm text-gray-600 gap-3">
                                        <Users size={16} className="text-gray-400" />
                                        <span><strong className="text-gray-900">{cls.presentToday} / {cls.totalStudents}</strong> Students Present</span>
                                    </div>

                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div className={`h-2.5 rounded-full ${percentage > 80 ? 'bg-green-500' : percentage > 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${percentage}%` }}></div>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600 gap-3 pt-2">
                                        <GraduationCap size={16} className="text-gray-400" />
                                        <span>In-charge: <strong>{cls.facultyIncharge}</strong></span>
                                    </div>
                                </div>

                                <div className="px-5 py-3 bg-gray-50 text-sm border-t border-gray-100">
                                    <span className="text-gray-500">Current Topic: </span>
                                    <span className="font-semibold text-gray-800">{cls.topic}</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center max-w-2xl mx-auto">
                <CheckCircle size={48} className="mx-auto text-blue-500 mb-4 opacity-75" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Detailed Reports</h2>
                <p className="text-gray-600 mb-6">Want to view detailed student-wise attendance or generate monthly reports for a specific class?</p>
                <div className="flex justify-center gap-4">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">View Detailed Logs</button>
                    <button className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg font-bold hover:bg-gray-200 transition border border-gray-200">Export Summary Data</button>
                </div>
            </div>
        </div>
    );
}
