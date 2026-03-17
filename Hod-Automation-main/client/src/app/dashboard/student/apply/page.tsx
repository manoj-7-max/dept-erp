"use client";
import { useState } from 'react';

export default function StudentApply() {
    const [requestType, setRequestType] = useState('OD');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Application Submitted: ${requestType} on ${date}`);
        setDescription('');
        setDate('');
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">New Request Application</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 font-bold mb-2">Request Type</label>
                    <select
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                        value={requestType}
                        onChange={(e) => setRequestType(e.target.value)}
                    >
                        <option value="OD">On Duty (OD)</option>
                        <option value="LEAVE">Leave</option>
                        <option value="SYLLABUS">Syllabus Clarification</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 font-bold mb-2">Date</label>
                    <input
                        type="date"
                        required
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-bold mb-2">Reason / Description</label>
                    <textarea
                        className="w-full border p-2 rounded h-32 focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter detailed reason..."
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <div className="flex justify-end gap-4">
                    <button type="button" className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition">
                        Submit Request
                    </button>
                </div>
            </form>
        </div>
    );
}
