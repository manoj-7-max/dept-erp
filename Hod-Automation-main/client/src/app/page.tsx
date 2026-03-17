"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Users, Building, UserCircle, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] });

export default function SplitLoginPage() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'faculty' | 'hod' | 'student' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (role: 'faculty' | 'hod' | 'student') => {
    setSelectedRole(role);
    setError('');
    // Pre-fill for demo convenience, or clear for production
    if (role === 'hod') { setEmail('hod@college.edu'); setPassword('admin123'); }
    if (role === 'faculty') { setEmail('faculty@college.edu'); setPassword('faculty123'); }
    if (role === 'student') { setEmail('student@college.edu'); setPassword('student123'); }
  };

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
      const isStudent = selectedRole === 'student';
      const apiUrl = isStudent 
        ? 'http://localhost:5001/api/auth/login' 
        : 'http://localhost:5002/api/auth/login';

      const loginData = isStudent 
        ? { registerNumber: email, password } // Student uses registerNumber but we use the email field for it
        : { email, password };

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned non-JSON response. Check backend logs.");
      }

      const data = await res.json();
      if (res.ok) {
        if (isStudent) {
          // Store for Student Portal compatibility
          localStorage.setItem('userInfo', JSON.stringify({
            _id: data._id,
            name: data.name,
            registerNumber: data.registerNumber,
            email: data.email,
            token: data.token
          }));
          
          // Map to HOD Portal's AuthContext user format
          const mappedUser = {
            id: data._id,
            name: data.name,
            role: 'student' as const,
            department: 'N/A'
          };
          login(data.token, mappedUser);
        } else {
          // Faculty/HOD
          const isRoleCorrect = data.user.role === selectedRole || (selectedRole === 'faculty' && data.user.role === 'class_incharge');
          
          if (!isRoleCorrect) {
            setError(`Please log in as a ${selectedRole} account.`);
            return;
          }
          login(data.token, data.user);
        }
      } else {
        setError(data.msg || data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Server connection error');
    }
  };

  if (!selectedRole) {
    return (
      <div className={`relative min-h-screen flex flex-col overflow-hidden ${poppins.className}`}>
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700 blur-[3px]"
          style={{ backgroundImage: "url('/campus.png')" }}
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-black/50 to-black/80" />

        {/* Header Container */}
        <header className="relative z-20 w-full flex justify-between items-center px-6 py-4 md:px-10 md:py-6">
          <div className="bg-white/10 backdrop-blur-md p-2 md:p-3 rounded-xl border border-white/20 shadow-lg ml-0 md:ml-2 mt-2 md:mt-0">
            <img src="/kvcet_logo.png" alt="KVCET Logo" className="h-12 md:h-14 lg:h-16 object-contain drop-shadow-md" />
          </div>
          <div className="text-white/80 hover:text-white cursor-pointer transition-all transform hover:scale-110 drop-shadow-lg pr-2 md:pr-4">
            <UserCircle size={36} strokeWidth={1.5} />
          </div>
        </header>

        {/* Content Container */}
        <div className="relative z-20 w-full max-w-6xl flex flex-col items-center flex-1 justify-center mx-auto px-4 pb-12 mt-[-2%] md:mt-[-5%] overflow-y-auto pt-10">

          {/* Title Section */}
          <div className="text-center mb-10 md:mb-14">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] tracking-tight">
              Select Your Portal
            </h1>
            <p className="text-base md:text-lg text-gray-200 font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-widest uppercase opacity-90">
              Department Automation System
            </p>
          </div>

          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full max-w-6xl px-2">

            {/* Student Card */}
            <div
              onClick={() => handleRoleSelect('student')}
              className="group relative bg-black/50 backdrop-blur-md border border-white/10 p-8 rounded-3xl cursor-pointer 
                         transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.03] hover:bg-black/40 hover:border-emerald-500/60 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]
                         flex flex-col items-center text-center shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
            >
              <div className="w-16 h-16 rounded-full mb-6 flex items-center justify-center text-white 
                              bg-gradient-to-br from-emerald-500 to-teal-600 
                              shadow-[0_0_20px_rgba(16,185,129,0.5)] group-hover:shadow-[0_0_40_rgba(16,185,129,0.8)] transition-all duration-300">
                <GraduationCap size={32} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2 tracking-wide drop-shadow-md">Student</h2>
              <p className="text-gray-300 text-sm leading-relaxed opacity-90">View attendance, internal marks, and academic resources.</p>
            </div>

            {/* Faculty Card */}
            <div
              onClick={() => handleRoleSelect('faculty')}
              className="group relative bg-black/50 backdrop-blur-md border border-white/10 p-8 rounded-3xl cursor-pointer 
                         transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.03] hover:bg-black/40 hover:border-purple-500/60 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]
                         flex flex-col items-center text-center shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
            >
              <div className="w-16 h-16 rounded-full mb-6 flex items-center justify-center text-white 
                              bg-gradient-to-br from-purple-500 to-indigo-600 
                              shadow-[0_0_20px_rgba(168,85,247,0.5)] group-hover:shadow-[0_0_40px_rgba(168,85,247,0.8)] transition-all duration-300">
                <Users size={32} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2 tracking-wide drop-shadow-md">Faculty</h2>
              <p className="text-gray-300 text-sm leading-relaxed opacity-90">Manage attendance, marks, and academic resources.</p>
            </div>

            {/* HOD Card */}
            <div
              onClick={() => handleRoleSelect('hod')}
              className="group relative bg-black/50 backdrop-blur-md border border-white/10 p-8 rounded-3xl cursor-pointer 
                         transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.03] hover:bg-black/40 hover:border-red-500/60 hover:shadow-[0_0_40px_rgba(239,68,68,0.4)]
                         flex flex-col items-center text-center shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
            >
              <div className="w-16 h-16 rounded-full mb-6 flex items-center justify-center text-white 
                              bg-gradient-to-br from-red-500 to-rose-600 
                              shadow-[0_0_20px_rgba(239,68,68,0.5)] group-hover:shadow-[0_0_40px_rgba(239,68,68,0.8)] transition-all duration-300">
                <Building size={32} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2 tracking-wide drop-shadow-md">HOD / Admin</h2>
              <p className="text-gray-300 text-sm leading-relaxed opacity-90">Department oversight, administration, and analytics.</p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-20 w-full text-center py-6 mt-auto">
          <p className="text-white/50 text-sm font-medium tracking-wide">
            © 2026 Karpaga Vinayaga Educational Group | ERP Portal
          </p>
        </footer>
      </div>
    );
  }

  const getRoleColor = () => {
    switch(selectedRole) {
      case 'student': return 'from-emerald-700 to-emerald-500';
      case 'faculty': return 'from-purple-700 to-purple-500';
      case 'hod': return 'from-red-700 to-red-500';
      default: return 'from-blue-700 to-blue-500';
    }
  };

  const getButtonColor = () => {
    switch(selectedRole) {
      case 'student': return 'from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-emerald-500/30';
      case 'faculty': return 'from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 shadow-purple-500/30';
      case 'hod': return 'from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-red-500/30';
      default: return 'from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-blue-500/30';
    }
  };

  const getFocusColor = () => {
    switch(selectedRole) {
      case 'student': return 'focus:border-emerald-500 focus:ring-emerald-500/20';
      case 'faculty': return 'focus:border-purple-500 focus:ring-purple-500/20';
      case 'hod': return 'focus:border-red-500 focus:ring-red-500/20';
      default: return 'focus:border-blue-500 focus:ring-blue-500/20';
    }
  };

  const getRoleIcon = () => {
    switch(selectedRole) {
      case 'student': return <GraduationCap size={32} className="mx-auto mb-2" />;
      case 'faculty': return <Users size={32} className="mx-auto mb-2" />;
      case 'hod': return <Building size={32} className="mx-auto mb-2" />;
      default: return null;
    }
  };

  return (
    <div className={`relative min-h-screen flex items-center justify-center p-6 overflow-hidden ${poppins.className}`}>
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700 blur-[4px]"
        style={{ backgroundImage: "url('/campus.png')" }}
      />

      {/* Dark Overlay Layer */}
      <div className="absolute inset-0 z-10 bg-black/60" />

      {/* Back Button */}
      <button
        onClick={() => setSelectedRole(null)}
        className="absolute top-8 left-8 z-30 text-white/80 hover:text-white flex items-center gap-2 font-medium transition-all hover:-translate-x-1"
      >
        <span className="text-2xl">&larr;</span> <span className="text-lg">Back</span>
      </button>

      {/* Login Card Container */}
      <div className="relative z-20 bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden max-w-md w-full flex flex-col transform transition-all duration-500 border border-white/20">

        {/* Header Section */}
        <div className={`p-8 pb-6 text-center text-white bg-gradient-to-br ${getRoleColor()} transition-all duration-500`}>
          <img src="/kvcet_logo.png" alt="Logo" className="h-10 mx-auto mb-4 object-contain drop-shadow-md" />
          <h2 className="text-3xl font-extrabold mb-1 tracking-wide uppercase">
            {selectedRole} Login
          </h2>
          <p className="opacity-90 text-sm font-medium tracking-wide">Enter your credentials to continue</p>
        </div>

        {/* Form Section */}
        <div className="p-8 md:p-10">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm mb-6 text-center border border-red-100 font-semibold">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-900 font-bold mb-2 text-xs uppercase tracking-widest">
                {selectedRole === 'student' ? 'Register Number / ID' : 'Email Address'}
              </label>
              <input
                type={selectedRole === 'student' ? "text" : "email"}
                className={`w-full p-4 rounded-2xl bg-gray-100 border border-gray-200 outline-none transition-all shadow-inner focus:bg-white focus:ring-4 text-gray-900 font-semibold placeholder:text-gray-500 placeholder:font-medium opacity-100 ${getFocusColor()}`}
                value={email}
                placeholder={selectedRole === 'student' ? "e.g. CS2023001" : "email@college.edu"}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-900 font-bold mb-2 text-xs uppercase tracking-widest">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full p-4 pr-12 rounded-2xl bg-gray-100 border border-gray-200 outline-none transition-all shadow-inner focus:bg-white focus:ring-4 text-gray-900 font-semibold placeholder:text-gray-500 placeholder:font-medium opacity-100 ${getFocusColor()}`}
                  value={password}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className={`w-full py-4 mt-2 rounded-2xl font-bold text-white text-lg transition-all transform hover:-translate-y-1 hover:shadow-xl active:scale-95 bg-gradient-to-r ${getButtonColor()}`}
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

