"use client";
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold text-blue-900 tracking-tighter">
                            Edu<span className="text-blue-600">Portal</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex space-x-8">
                        <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition">Home</Link>
                        <Link href="/about" className="text-gray-600 hover:text-blue-600 font-medium transition">About Dept</Link>
                        <Link href="/faculty" className="text-gray-600 hover:text-blue-600 font-medium transition">Faculty</Link>
                        <Link href="/facilities" className="text-gray-600 hover:text-blue-600 font-medium transition">Facilities</Link>
                        <Link href="/contact" className="text-gray-600 hover:text-blue-600 font-medium transition">Contact</Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium">Log In</Link>
                        <Link href="/login" className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
                            Student Portal
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
