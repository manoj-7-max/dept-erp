"use client";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { BookOpen, Users, ArrowRight, ShieldCheck } from 'lucide-react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export default function RoleSelectionPage() {
    const { user, setSelectedRole } = useAuth();
    const router = useRouter();

    const handleSelect = (role: 'faculty' | 'incharge') => {
        setSelectedRole(role);
        if (role === 'faculty') {
            router.push('/dashboard/faculty');
        } else {
            router.push('/dashboard/incharge');
        }
    };

    if (!user || user.role !== 'class_incharge') {
        // Redirect if not class incharge
        if (typeof window !== 'undefined') {
            router.push('/dashboard');
        }
        return null;
    }

    return (
        <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-6 ${poppins.className}`}>
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-4 text-blue-600 shadow-sm border border-blue-200">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Select Access Mode</h1>
                    <p className="text-gray-500 text-lg max-w-lg mx-auto">
                        You are assigned as a <span className="text-blue-600 font-bold">Class Incharge</span>.
                        Choose the module you want to access.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Faculty Mode Card */}
                    <button
                        onClick={() => handleSelect('faculty')}
                        className="group relative bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-500 text-left flex flex-col items-start overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm relative z-10">
                            <BookOpen size={28} />
                        </div>
                        
                        <h2 className="text-2xl font-black text-gray-900 mb-2 relative z-10 tracking-tight">Faculty Side</h2>
                        <p className="text-gray-500 font-medium leading-relaxed mb-8 relative z-10">
                            Access teaching modules like lesson plan, notes upload, logbook, and research papers.
                        </p>
                        
                        <div className="mt-auto flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest relative z-10 transition-transform duration-300 group-hover:translate-x-2">
                            Enter Teaching Portal <ArrowRight size={18} />
                        </div>
                    </button>

                    {/* Class Incharge Mode Card */}
                    <button
                        onClick={() => handleSelect('incharge')}
                        className="group relative bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-200 transition-all duration-500 text-left flex flex-col items-start overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm relative z-10">
                            <Users size={28} />
                        </div>

                        <h2 className="text-2xl font-black text-gray-900 mb-2 relative z-10 tracking-tight">Class Incharge Side</h2>
                        <p className="text-gray-500 font-medium leading-relaxed mb-8 relative z-10">
                            Access class management modules like attendance, internal marks, student feedback, and academic records.
                        </p>

                        <div className="mt-auto flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest relative z-10 transition-transform duration-300 group-hover:translate-x-2">
                            Enter Management Portal <ArrowRight size={18} />
                        </div>
                    </button>
                </div>

                <div className="mt-12 text-center text-sm text-gray-400 font-medium tracking-wide">
                    Note: You can switch between these modes anytime from the dashboard toggle.
                </div>
            </div>
        </div>
    );
}
