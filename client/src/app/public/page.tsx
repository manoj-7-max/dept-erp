"use client";
import Home from '@/app/page_public_backup'; // Rename original home to something else if needed, or just recreate logic
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

export default function PublicHome() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="container mx-auto px-4 text-center z-10 relative">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6"
                    >
                        Department of <span className="text-blue-600 block mt-2">Computer Science</span>
                    </motion.h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Empowering the next generation of engineers with world-class education, state-of-the-art labs, and a vibrant research ecosystem.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a href="#about" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-full font-medium hover:border-gray-800 transition">Learn More</a>
                        <a href="/" className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition">Portal Login</a>
                    </div>
                </div>
            </section>
            {/* Copy rest of public landing logic if desired */}
        </div>
    );
}
