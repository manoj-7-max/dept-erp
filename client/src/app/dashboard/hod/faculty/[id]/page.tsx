"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, GraduationCap, Briefcase, BookOpen, Layers, Award, FileText, CheckCircle2, AlertTriangle, MessageSquareHeart } from 'lucide-react';
import Link from 'next/link';

export default function FacultyAnalyticsDetail() {
    const { id } = useParams();
    const router = useRouter();
    const { token } = useAuth();

    // We are generating realistic derived analytics data locally for the prototype.
    // In a full production build, this would strictly route to a backend /api/hod/faculty/analytics/:id
    const [facultyData, setFacultyData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAndMapData = async () => {
            try {
                if (!token) return;

                // Fetch the real faculty from DB
                const res = await fetch(`https://dept-erp.onrender.com/api/hod/faculty`, {
                    headers: { 'x-auth-token': token }
                });

                if (!res.ok) throw new Error("Failed to fetch faculty list");

                const facultyList = await res.json();
                const realFac = facultyList.find((f: any) => f._id === id);

                if (!realFac) {
                    setFacultyData(null);
                    setLoading(false);
                    return;
                }

                const facName = realFac.name || "";

                let data = null;
                if (facName.includes('Vinitha')) {
                    data = {
                        name: realFac.name, role: realFac.designation || 'Assistant Professor', dept: realFac.department || 'Computer Science and Engineering',
                        facultyId: realFac._id.substring(0, 8).toUpperCase(), initials: 'GV', color: 'from-pink-600 to-rose-500',
                        qualifications: realFac.isDoctorate ? 'M.E., Ph.D.' : 'M.E.', spec: 'Machine Learning', exp: '6 Years',
                        classInCharge: 'II Year CSE - B', subjectsTotal: 3,
                        pubs: { total: 4, scopus: 2, sci: 0, conf: 2, target: 2, achieved: 2 },
                        metrics: { attendance: 99, resources: 24, feedback: 4.8 }
                    };
                } else if (facName.includes('Vani Shree')) {
                    data = {
                        name: realFac.name, role: realFac.designation || 'Assistant Professor', dept: realFac.department,
                        facultyId: realFac._id.substring(0, 8).toUpperCase(), initials: 'KV', color: 'from-orange-500 to-rose-500',
                        qualifications: realFac.isDoctorate ? 'M.Tech., Ph.D.' : 'M.Tech.', spec: 'Internet of Things', exp: '5 Years',
                        classInCharge: 'N/A', subjectsTotal: 2,
                        pubs: { total: 2, scopus: 1, sci: 0, conf: 1, target: 2, achieved: 1 },
                        metrics: { attendance: 95, resources: 16, feedback: 4.5 }
                    };
                } else if (facName.includes('Gayathri')) {
                    data = {
                        name: realFac.name, role: realFac.designation || 'Assistant Professor', dept: realFac.department,
                        facultyId: realFac._id.substring(0, 8).toUpperCase(), initials: 'SG', color: 'from-fuchsia-600 to-purple-600',
                        qualifications: realFac.isDoctorate ? 'M.E., Ph.D.' : 'M.E.', spec: 'Data Science', exp: '4 Years',
                        classInCharge: 'I Year CSE - A', subjectsTotal: 4,
                        pubs: { total: 0, scopus: 0, sci: 0, conf: 0, target: 2, achieved: 0 },
                        metrics: { attendance: 92, resources: 31, feedback: 4.3 }
                    };
                } else if (facName.includes('Thiyagarajan')) {
                    data = {
                        name: realFac.name, role: realFac.designation || 'Professor', dept: realFac.department,
                        facultyId: realFac._id.substring(0, 8).toUpperCase(), initials: 'VT', color: 'from-indigo-700 to-blue-600',
                        qualifications: realFac.isDoctorate ? 'M.E., Ph.D.' : 'M.E.', spec: 'Cyber Security', exp: '18 Years',
                        classInCharge: 'III Year CSE - A', subjectsTotal: 2,
                        pubs: { total: 12, scopus: 5, sci: 3, conf: 4, target: 3, achieved: 2 },
                        metrics: { attendance: 100, resources: 12, feedback: 4.9 }
                    };
                } else if (facName.includes('Muthuselvi')) {
                    data = {
                        name: realFac.name, role: realFac.designation || 'Assistant Professor', dept: realFac.department,
                        facultyId: realFac._id.substring(0, 8).toUpperCase(), initials: 'MM', color: 'from-teal-600 to-emerald-500',
                        qualifications: realFac.isDoctorate ? 'M.E., Ph.D.' : 'M.E.', spec: 'Cloud Computing', exp: '8 Years',
                        classInCharge: 'IV Year CSE', subjectsTotal: 3,
                        pubs: { total: 3, scopus: 1, sci: 0, conf: 2, target: 1, achieved: 1 },
                        metrics: { attendance: 97, resources: 18, feedback: 4.6 }
                    };
                } else {
                    const initials = facName.substring(0, 2).toUpperCase();
                    data = {
                        name: realFac.name, role: realFac.designation || 'Staff', dept: realFac.department || 'Computer Science and Engineering',
                        facultyId: realFac._id.substring(0, 8).toUpperCase(), initials: initials, color: 'from-gray-600 to-slate-500',
                        qualifications: realFac.isDoctorate ? 'Doctorate' : 'Masters', spec: 'General CS', exp: 'N/A',
                        classInCharge: 'N/A', subjectsTotal: 1,
                        pubs: { total: 0, scopus: 0, sci: 0, conf: 0, target: 1, achieved: 0 },
                        metrics: { attendance: 85, resources: 5, feedback: 4.0 }
                    };
                }

                setFacultyData(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
                setFacultyData(null);
            }
        };

        fetchAndMapData();
    }, [id, token]);

    if (loading) return <div className="p-10 text-center text-gray-500 font-bold">Loading Faculty Analytics Engine...</div>;
    if (!facultyData) return <div className="p-10 text-center text-red-500 font-bold">Faculty Not Found in System</div>;

    const pubProgress = facultyData.pubs.target > 0 ? Math.min(Math.round((facultyData.pubs.achieved / facultyData.pubs.target) * 100), 100) : 0;

    return (
        <div className="py-6 max-w-7xl mx-auto space-y-8">
            <Link href="/dashboard/hod/faculty" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 hover:shadow-md">
                <ArrowLeft size={16} /> Back to Faculty List
            </Link>

            {/* Profile Header */}
            <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>

                <div className={`w-32 h-32 bg-gradient-to-br ${facultyData.color} rounded-full flex items-center justify-center text-5xl font-black text-white shadow-xl ring-4 ring-white relative z-10 shrink-0`}>
                    {facultyData.initials}
                </div>
                <div className="relative z-10 text-center md:text-left flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{facultyData.name}</h1>
                            <p className="text-gray-600 font-semibold text-lg mt-1">{facultyData.role}</p>
                            <p className="text-gray-400 text-sm font-medium">{facultyData.dept}</p>
                        </div>
                        <div className="flex gap-3 justify-center md:justify-end">
                            <span className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold tracking-widest uppercase border border-slate-200">
                                ID: {facultyData.facultyId}
                            </span>
                            <span className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold tracking-widest uppercase border border-blue-100">
                                Exp: {facultyData.exp}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Academic & Teaching Load */}
                <div className="space-y-8">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-3">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><GraduationCap size={20} /></div>
                            Academic Information
                        </h2>
                        <ul className="space-y-4">
                            <li className="flex justify-between items-center border-b border-gray-100 pb-3">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Qualification</span>
                                <span className="font-extrabold text-gray-900">{facultyData.qualifications}</span>
                            </li>
                            <li className="flex justify-between items-center pb-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Specialization</span>
                                <span className="font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">{facultyData.spec}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><BookOpen size={20} /></div>
                            Teaching Load Target
                        </h2>
                        <ul className="space-y-4">
                            <li className="flex justify-between items-center border-b border-gray-100 pb-3">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Class In-charge</span>
                                <span className="font-extrabold text-gray-900">{facultyData.classInCharge}</span>
                            </li>
                            <li className="flex justify-between items-center pb-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Subjects Handled currently</span>
                                <span className="font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-xl text-lg">{facultyData.subjectsTotal}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Research & Publications Analytics */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col">
                    <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Award size={20} /></div>
                        Research & Accreditation Metrics
                    </h2>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Hub</p>
                            <p className="text-4xl font-black text-slate-800">{facultyData.pubs.total}</p>
                        </div>
                        <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 text-center">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Scopus Recognized</p>
                            <p className="text-4xl font-black text-indigo-700">{facultyData.pubs.scopus}</p>
                        </div>
                        <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 text-center">
                            <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">SCI Indexed</p>
                            <p className="text-4xl font-black text-purple-700">{facultyData.pubs.sci}</p>
                        </div>
                        <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100 text-center">
                            <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Conferences</p>
                            <p className="text-4xl font-black text-rose-700">{facultyData.pubs.conf}</p>
                        </div>
                    </div>

                    <div className="mt-auto bg-gray-50 p-6 rounded-2xl border border-gray-200">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Annual Accreditation Target</p>
                                <p className="text-sm font-bold text-gray-800 mt-1">{facultyData.pubs.achieved} Compiled / {facultyData.pubs.target} Required</p>
                            </div>
                            <span className="text-3xl font-black text-blue-600">{pubProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-all duration-1000 ease-out relative overflow-hidden" style={{ width: `${pubProgress}%` }}>
                                <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Analytics Floor */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <h2 className="text-lg font-black text-gray-800 mb-8 flex items-center gap-3">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Layers size={20} /></div>
                    Overall Performance Engine
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-5 p-5 border border-gray-100 rounded-2xl bg-white hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                            <CheckCircle2 size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Attendance Submission</p>
                            <p className="text-2xl font-black text-gray-900">{facultyData.metrics.attendance}% <span className="text-xs font-bold text-green-500 ml-1">Reliability</span></p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 p-5 border border-gray-100 rounded-2xl bg-white hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                            <FileText size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Course Resource Uploads</p>
                            <p className="text-2xl font-black text-gray-900">{facultyData.metrics.resources} <span className="text-xs font-bold text-gray-500 ml-1">Docs</span></p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 p-5 border border-gray-100 rounded-2xl bg-white hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
                            <MessageSquareHeart size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Student Satisfaction Score</p>
                            <p className="text-2xl font-black text-gray-900">{facultyData.metrics.feedback} <span className="text-xs font-bold text-gray-500 ml-1">/ 5.0</span></p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
