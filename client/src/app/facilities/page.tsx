"use client";
import React from 'react';

export default function FacilitiesPage() {
    const facilities = [
        {
            title: "Advanced AI Lab",
            description: "Equipped with high-performance GPUs (NVIDIA A100) for deep learning and AI research.",
            image: "bg-blue-100" // Placeholder
        },
        {
            title: "IoT & Embedded Systems Lab",
            description: "State-of-the-art sensors, actuators, and microcontrollers for IoT prototyping.",
            image: "bg-green-100"
        },
        {
            title: "Cloud Computing Center",
            description: "Private cloud infrastructure for hosting student projects and research data.",
            image: "bg-purple-100"
        },
        {
            title: "Cyber Security Research Lab",
            description: "Isolated network environment for ethical hacking and security testing.",
            image: "bg-red-100"
        }
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">Our Facilities</h1>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16">
                We provide world-class infrastructure to support our students' learning and research needs.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
                {facilities.map((fac, idx) => (
                    <div key={idx} className="group cursor-pointer">
                        <div className={`h-64 rounded-2xl mb-6 ${fac.image} flex items-center justify-center text-gray-400 font-bold text-xl overflow-hidden relative`}>
                            {/* In real app, use <Image /> */}
                            <span className="group-hover:scale-110 transition duration-500">Image: {fac.title}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{fac.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{fac.description}</p>
                    </div>
                ))}
            </div>

            <div className="mt-20 bg-gray-900 text-white rounded-3xl p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">24/7 Library Access</h2>
                <p className="text-gray-400 max-w-xl mx-auto mb-8">
                    Our digital and physical library is open round the clock for students during exam periods.
                </p>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition">
                    View Library Catalog
                </button>
            </div>
        </div>
    );
}
