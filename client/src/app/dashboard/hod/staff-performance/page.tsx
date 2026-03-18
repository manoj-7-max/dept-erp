"use client";
import React from 'react';
import { 
    Users, Target, AlertTriangle, TrendingUp, 
    Download, Eye, Bell, CheckCircle, FileText, 
    CalendarCheck, Award 
} from 'lucide-react';

export default function StaffPerformance() {
    // Placeholder Data
    const summaryCards = [
        { title: "Total Faculty", value: "24", icon: Users, color: "bg-blue-50 text-blue-600" },
        { title: "Meeting Targets", value: "18", icon: Target, color: "bg-green-50 text-green-600" },
        { title: "Below Target", value: "6", icon: AlertTriangle, color: "bg-red-50 text-red-600" },
        { title: "Avg Performance", value: "82%", icon: TrendingUp, color: "bg-purple-50 text-purple-600" }
    ];

    const targetStats = [
        { label: "Publication Target vs Achieved", achieved: 32, target: 40, icon: Award, percentage: 80, color: "bg-indigo-500" },
        { label: "Lesson Plan Completion", achieved: 90, target: 100, icon: FileText, percentage: 90, color: "bg-green-500" },
        { label: "Attendance Update Rate", achieved: 85, target: 100, icon: CalendarCheck, percentage: 85, color: "bg-blue-500" },
        { label: "Marks Upload Completion", achieved: 75, target: 100, icon: CheckCircle, percentage: 75, color: "bg-orange-500" }
    ];

    const facultyData = [
        { id: 1, name: "Dr. Subramani V", subjects: 2, lessonPlan: "100%", attendance: "Updated", marks: "Updated", publications: 4, feedback: "4.8", score: 92, status: "Excellent" },
        { id: 2, name: "Prof. Anitha K", subjects: 3, lessonPlan: "85%", attendance: "Pending", marks: "Updated", publications: 1, feedback: "4.1", score: 75, status: "Average" },
        { id: 3, name: "Dr. Karthik M", subjects: 2, lessonPlan: "60%", attendance: "Pending", marks: "Pending", publications: 0, feedback: "3.5", score: 55, status: "Needs Improvement" },
        { id: 4, name: "Prof. Ramesh T", subjects: 2, lessonPlan: "95%", attendance: "Updated", marks: "Updated", publications: 2, feedback: "4.5", score: 88, status: "Excellent" },
        { id: 5, name: "Dr. Priya S", subjects: 3, lessonPlan: "80%", attendance: "Updated", marks: "Pending", publications: 1, feedback: "4.0", score: 72, status: "Average" }
    ];

    const getStatusStyle = (status: string) => {
        if (status === 'Excellent') return 'bg-green-50 text-green-700 border-green-200';
        if (status === 'Average') return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        return 'bg-red-50 text-red-700 border-red-200';
    };

    const getProgressBarColor = (score: number) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 65) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-gray-800">Staff Performance Evaluation</h1>
                <p className="text-gray-500">Monitor faculty academic activities, research contributions, and overall performance metrics.</p>
            </div>

            {/* Performance Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {summaryCards.map((card, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${card.color}`}>
                            <card.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{card.title}</p>
                            <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Target vs Achieved Section */}
            <div className="bg-white p-6 text-gray-800 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-lg font-bold mb-6 text-gray-800 border-b pb-4">Target vs Achieved</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {targetStats.map((stat, i) => (
                        <div key={i}>
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                    <stat.icon size={16} className="text-gray-400" />
                                    <span className="text-sm font-bold text-gray-700">{stat.label}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-600">{stat.achieved} / {stat.target}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div 
                                    className={`${stat.color} h-2.5 rounded-full transition-all duration-1000`} 
                                    style={{ width: `${stat.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Faculty Performance Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8 overflow-x-auto">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">Faculty Performance Roster</h2>
                </div>
                <table className="min-w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Faculty Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Subjects Handled</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Lesson Plan</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Attendance Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Marks Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Publications</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Feedback Score</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[150px]">Performance Score</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {facultyData.map(f => (
                            <tr key={f.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 text-sm font-bold text-gray-800 whitespace-nowrap">{f.name}</td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">{f.subjects}</td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-600">{f.lessonPlan}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${f.attendance === 'Updated' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {f.attendance}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${f.marks === 'Updated' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {f.marks}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">{f.publications}</td>
                                <td className="px-6 py-4 text-sm font-bold text-blue-600 text-center">{f.feedback} / 5.0</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className={`${getProgressBarColor(f.score)} h-2 rounded-full`} style={{ width: `${f.score}%` }}></div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-700">{f.score}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getStatusStyle(f.status)}`}>
                                        {f.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* HOD Actions */}
            <div className="flex flex-wrap gap-4 mt-8">
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-bold text-sm shadow-sm transition">
                    <Eye size={18} /> View Detailed Faculty Report
                </button>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg font-bold text-sm shadow-sm transition">
                    <Download size={18} /> Download Performance Report
                </button>
                <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg font-bold text-sm shadow-sm transition">
                    <Bell size={18} /> Send Improvement Notification
                </button>
            </div>
        </div>
    );
}
