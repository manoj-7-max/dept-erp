"use client";
import AnimatedPage from '@/components/AnimatedPage';
import ChatInterface from '@/components/ChatInterface';
import { MessageSquare } from 'lucide-react';

export default function MessagesPage() {
    return (
        <AnimatedPage>
            <div className="p-8 md:p-10 bg-slate-50/50 min-h-screen">
                {/* Header */}
                <div className="flex justify-between items-center mb-10 pb-4 border-b border-slate-200/60">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-4">
                            Communication Hub
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium text-sm tracking-wide">Real-time messaging across departments</p>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Status</p>
                            <p className="text-xs font-black text-green-500">Connected</p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                <ChatInterface />
            </div>
        </AnimatedPage>
    );
}
