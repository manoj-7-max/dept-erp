"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-32 container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                        <p className="text-gray-600 mb-6">
                            For admissions, general queries, or feedback, please reach out to us.
                        </p>
                        <div className="space-y-4">
                            <p><strong>Address:</strong> 123 College Road, Chennai, Tamil Nadu - 600025</p>
                            <p><strong>Phone:</strong> +91 44 2234 5678</p>
                            <p><strong>Email:</strong> cse@college.edu</p>
                        </div>
                    </div>
                    <form className="space-y-4">
                        <input className="w-full border p-3 rounded" placeholder="Your Name" />
                        <input className="w-full border p-3 rounded" placeholder="Your Email" />
                        <textarea className="w-full border p-3 rounded h-32" placeholder="Message"></textarea>
                        <button className="bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
