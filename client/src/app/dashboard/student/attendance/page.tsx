"use client";
import Link from 'next/link';

export default function StudentAttendance() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Attendance Record</h1>
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-500">Overall Attendance</p>
                        <p className="text-4xl font-bold text-green-600">85%</p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-500">Total Classes Conducted</p>
                        <p className="text-xl font-bold">120</p>
                    </div>
                </div>

                <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">Required: 75% to appear for exams.</p>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <h3 className="text-lg font-bold p-4 border-b">Subject-wise Breakdown</h3>
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4">Subject</th>
                            <th className="p-4">Conducted</th>
                            <th className="p-4">Attended</th>
                            <th className="p-4">%</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="p-4">Data Structures</td>
                            <td className="p-4">40</td>
                            <td className="p-4">38</td>
                            <td className="p-4 text-green-600 font-bold">95%</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-4">Maths IV</td>
                            <td className="p-4">35</td>
                            <td className="p-4">25</td>
                            <td className="p-4 text-red-600 font-bold">71%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
