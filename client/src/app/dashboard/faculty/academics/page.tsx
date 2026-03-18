"use client";
import React from 'react';
import { BookOpen, BookText, FileText, ClipboardList, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AcademicsPage() {
    const modules = [
        {
            title: "Lesson Plan",
            description: "Manage and update your course lesson plans and teaching schedules.",
            icon: BookText,
            href: "/dashboard/faculty/academics/lesson-plan",
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Logbook",
            description: "Record daily class activities, topics covered, and student attendance.",
            icon: ClipboardList,
            href: "/dashboard/faculty/academics/logbook",
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            title: "Notes Upload",
            description: "Upload and share study materials, lecture notes, and resources with students.",
            icon: FileText,
            href: "/dashboard/faculty/academics/notes",
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        }
    ];

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Academics Module</h1>
                <p className="text-gray-500">Access and manage your teaching activities and academic resources.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {modules.map((module, index) => (
                    <Link 
                        key={index} 
                        href={module.href}
                        className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-start"
                    >
                        <div className={`p-4 rounded-xl ${module.bg} ${module.color} mb-6 transition-transform group-hover:scale-110`}>
                            <module.icon size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors uppercase tracking-wide">
                            {module.title}
                        </h2>
                        <p className="text-gray-500 leading-relaxed mb-8 flex-grow">
                            {module.description}
                        </p>
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest mt-auto">
                            Access Module
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </div>
                    </Link>
                ))}
            </div>
            
            <div className="mt-16 p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-500/20">
                <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold mb-2">Need Help with Academics?</h2>
                    <p className="text-blue-50 opacity-90 max-w-xl">
                        Explore our internal documentation or contact the administration if you encounter any issues managing your course materials.
                    </p>
                </div>
                <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition-colors shrink-0">
                    View FAQ
                </button>
            </div>
        </div>
    );
}
