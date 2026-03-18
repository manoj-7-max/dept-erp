"use client";
import React from 'react';
import Navbar from '@/components/Navbar'; // Assuming we want navbar here too since it's a public page

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-32 container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">About the Department</h1>

                <div className="bg-white p-8 rounded-2xl shadow-sm mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-blue-600">History & Overview</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        Established in 1998, the Department of Computer Science and Engineering has been at the forefront of technological education.
                        We started with an intake of 60 students and have now grown to a family of 500+ students and 45+ expert faculty members.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Our curriculum is constantly updated to meet industry standards, incorporating the latest trends in AI, Machine Learning, Cloud Computing, and Cyber Security.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-10">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-blue-600">
                        <h2 className="text-2xl font-bold mb-4">Vision</h2>
                        <p className="text-gray-600 italic">
                            "To produce globally competent professionals with strong ethical values and research aptitude."
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-green-600">
                        <h2 className="text-2xl font-bold mb-4">Mission</h2>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li>Provide quality education through modern teaching methodologies.</li>
                            <li>Faster industry-institute interaction.</li>
                            <li>Encourage innovation and entrepreneurship.</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm">
                    <h2 className="text-2xl font-bold mb-6 text-center">HOD's Message</h2>
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-32 h-32 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-gray-500">
                            Photo
                        </div>
                        <div>
                            <p className="text-gray-600 italic mb-4">
                                "Welcome to the Department of CSE. We believe in nurturing not just engineers, but innovators who can solve real-world problems.
                                Our focus is on holistic development, combining academic rigor with practical exposure."
                            </p>
                            <p className="font-bold text-gray-900">Dr. Head of Dept</p>
                            <p className="text-sm text-gray-500">Professor & Head</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
