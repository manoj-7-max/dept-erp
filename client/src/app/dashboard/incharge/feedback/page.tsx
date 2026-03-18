"use client";
import React from 'react';
import { MessageSquare, Star, Search, Filter, MessageCircle, ArrowRight } from 'lucide-react';

export default function InchargeFeedback() {
    const feedbacks = [
        { id: 1, student: 'Student Name 1', subject: 'Data Structures', rating: 4, comment: 'The practical sessions are very helpful, but we need more examples on Dynamic Programming.' },
        { id: 2, student: 'Student Name 2', subject: 'DBMS', rating: 5, comment: 'Clear explanations and interactive lab sessions. Great subject!' },
    ];

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight text-blue-800">Student Feedback</h1>
                    <p className="text-gray-500 mt-1 font-medium text-sm">Monitor and review feedback submitted by students of your class</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                    <h3 className="text-lg font-black text-gray-900">Recent Feedbacks</h3>
                    <div className="flex gap-2">
                        <div className="relative">
                            <input type="text" placeholder="Search subject..." className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-xs bg-white w-48 transition" />
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </div>
                
                <div className="p-6 space-y-6">
                    {feedbacks.map((f) => (
                        <div key={f.id} className="p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 font-black text-xs">
                                        {f.student.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900">{f.student}</h4>
                                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{f.subject}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} size={14} className={s <= f.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-600 leading-relaxed pl-16">
                                "{f.comment}"
                            </p>
                            <div className="mt-6 pl-16 flex justify-end">
                                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:gap-3 transition-all">
                                    Acknowledge Feedback <ArrowRight size={14} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
