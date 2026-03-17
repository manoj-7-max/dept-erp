
"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        // --- Mock Login for Development/Testing ---
        if (email === 'incharge@college.edu' && password === 'incharge123') {
            login('mock-token-ci', {
                id: 'ci-001',
                name: 'Prof. Rajesh (CI)',
                role: 'class_incharge',
                department: 'CSE'
            });
            return;
        }
        // ------------------------------------------

        try {
            const res = await fetch('http://localhost:5002/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                login(data.token, data.user);
            } else {
                setError(data.msg || 'Login failed');
            }
        } catch (err) {
            setError('Server error');
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center bg-gray-50 ${poppins.className}`}>
            <Link href="/" className="absolute top-6 left-6 text-gray-500 hover:text-gray-900 flex items-center gap-2">
                &larr; Back to Home
            </Link>

            <div className="bg-white p-10 rounded-2xl shadow-xl w-[400px] border border-gray-100">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-500 text-sm mt-2">Sign in to access your portal</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-1 text-sm font-bold text-gray-900">Email Address</label>
                        <input
                            type="email"
                            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white outline-none transition text-gray-900 font-semibold placeholder:text-gray-500 placeholder:font-medium opacity-100"
                            placeholder="name@college.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-bold text-gray-900">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full p-3 pr-12 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white outline-none transition text-gray-900 font-semibold placeholder:text-gray-500 placeholder:font-medium opacity-100"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition shadow-md shadow-blue-600/20">
                        Sign In
                    </button>

                    <div className="text-center mt-6 p-4 bg-gray-50 rounded text-xs text-gray-500">
                        <p className="font-semibold mb-1">Demo Credentials:</p>
                        <p>HOD: hod@college.edu / admin123</p>
                        <p>Faculty: faculty@college.edu / faculty123</p>
                        <p>Incharge: incharge@college.edu / incharge123</p>
                        <p>Student: student@college.edu / student123</p>
                    </div>
                </form>
            </div>
        </div>
    );
}
