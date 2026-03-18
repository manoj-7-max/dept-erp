"use client";
import { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AlertTriangle, CheckCircle, Search, Lock } from 'lucide-react';

interface Student {
    id: string;
    name: string;
    rollNumber: string;
    status: 'Present' | 'Absent' | 'Late' | 'OD';
    reason: string;
    overallAttendance: number; // mocked overall %
}

const generateMockStudents = (year: number, section: string): Student[] => {
    const names = [
        'Arun Kumar', 'Priya Devi', 'Karthik Raja', 'Sridevi M', 'Mahesh K',
        'Anitha S', 'Vijay R', 'Ranjith N', 'Deepa KL', 'Naveen P'
    ];
    const baseRoll = `CSE${2026 - year}${section}`;
    return names.map((name, i) => ({
        id: `${year}${section}${i + 1}`,
        name,
        rollNumber: `${baseRoll}${(i + 1).toString().padStart(3, '0')}`,
        status: 'Present',
        reason: '',
        overallAttendance: Math.floor(Math.random() * 35) + 65, // 65–99%
    }));
};

export default function FacultyAttendance() {
    const { user } = useAuth();

    const [year, setYear] = useState<number>(2);
    const [section, setSection] = useState<string>('A');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [subject, setSubject] = useState('Data Structures');
    const [period, setPeriod] = useState('Hour 1');
    const [classType, setClassType] = useState('Theory');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [studentsData, setStudentsData] = useState<Record<string, Student[]>>({});

    const currentKey = `${year}-${section}`;

    const currentStudents: Student[] = useMemo(() => {
        if (studentsData[currentKey]) return studentsData[currentKey];
        return generateMockStudents(year, section);
    }, [year, section, studentsData, currentKey]);

    const setCurrentStudents = (updater: (prev: Student[]) => Student[]) => {
        setStudentsData(prev => ({
            ...prev,
            [currentKey]: updater(prev[currentKey] || generateMockStudents(year, section))
        }));
        setIsSubmitted(false);
    };

    const filteredStudents = useMemo(() => {
        const q = searchQuery.toLowerCase();
        if (!q) return currentStudents;
        return currentStudents.filter(s =>
            s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q)
        );
    }, [currentStudents, searchQuery]);

    const summary = useMemo(() => {
        const total = currentStudents.length;
        const present = currentStudents.filter(s => s.status === 'Present' || s.status === 'OD').length;
        const absent = currentStudents.filter(s => s.status === 'Absent').length;
        const late = currentStudents.filter(s => s.status === 'Late').length;
        const pct = total > 0 ? Math.round((present / total) * 100) : 0;
        return { total, present, absent, late, pct };
    }, [currentStudents]);

    const changeStatus = (id: string, newStatus: Student['status']) => {
        if (isSubmitted) return;
        setCurrentStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    };

    const changeReason = (id: string, reason: string) => {
        if (isSubmitted) return;
        setCurrentStudents(prev => prev.map(s => s.id === id ? { ...s, reason } : s));
    };

    const markAll = (status: Student['status']) => {
        if (isSubmitted) return;
        setCurrentStudents(prev => prev.map(s => ({ ...s, status })));
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        alert(`✅ Attendance submitted for ${year}${year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year Section ${section}\n📘 Subject: ${subject} | ${period} | ${classType}\n📅 Date: ${date}\nPresent: ${summary.present} | Absent: ${summary.absent}`);
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">
            {/* Page Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Mark Class Attendance</h1>
                    <p className="text-gray-500 mt-1">CSE Department — Academic Year 2025-26</p>
                </div>
                {isSubmitted && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg font-semibold text-sm">
                        <Lock size={16} /> Attendance Locked
                    </div>
                )}
            </div>

            {/* Top Form Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                {/* Row 1: Year, Section, Date, Faculty Name */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Year</label>
                        <select disabled={isSubmitted} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 disabled:opacity-60" value={year} onChange={e => { setYear(Number(e.target.value)); setIsSubmitted(false); }}>
                            <option value={2}>2nd Year</option>
                            <option value={3}>3rd Year</option>
                            <option value={4}>4th Year</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Section</label>
                        <select disabled={isSubmitted} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 disabled:opacity-60" value={section} onChange={e => { setSection(e.target.value); setIsSubmitted(false); }}>
                            <option value="A">Section A</option>
                            <option value="B">Section B</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Date</label>
                        <input type="date" disabled={isSubmitted} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 disabled:opacity-60" value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Faculty Name</label>
                        <input type="text" readOnly value={user?.name || 'Prof. John Doe'} className="w-full border p-2.5 rounded-lg bg-blue-50 text-blue-800 font-semibold cursor-default outline-none" />
                    </div>
                </div>

                {/* Row 2: Subject, Period, Class Type */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Subject</label>
                        <select disabled={isSubmitted} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 disabled:opacity-60" value={subject} onChange={e => setSubject(e.target.value)}>
                            <option>Data Structures</option>
                            <option>Operating Systems</option>
                            <option>Computer Networks</option>
                            <option>Software Engineering</option>
                            <option>Machine Learning</option>
                            <option>Artificial Intelligence</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Period / Hour</label>
                        <select disabled={isSubmitted} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 disabled:opacity-60" value={period} onChange={e => setPeriod(e.target.value)}>
                            <option>Hour 1</option>
                            <option>Hour 2</option>
                            <option>Hour 3</option>
                            <option>Hour 4</option>
                            <option>Hour 5</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Class Type</label>
                        <select disabled={isSubmitted} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 disabled:opacity-60" value={classType} onChange={e => setClassType(e.target.value)}>
                            <option>Theory</option>
                            <option>Lab</option>
                            <option>Tutorial</option>
                            <option>Seminar</option>
                        </select>
                    </div>
                </div>

                {/* Action Buttons Row */}
                <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-100 gap-4">
                    <div className="flex gap-3">
                        <button disabled={isSubmitted} onClick={() => markAll('Present')} className="px-4 py-2 bg-green-50 text-green-700 font-semibold rounded-lg hover:bg-green-100 transition border border-green-200 disabled:opacity-50">✓ Mark All Present</button>
                        <button disabled={isSubmitted} onClick={() => markAll('Absent')} className="px-4 py-2 bg-red-50 text-red-700 font-semibold rounded-lg hover:bg-red-100 transition border border-red-200 disabled:opacity-50">✗ Mark All Absent</button>
                    </div>
                    <button disabled={isSubmitted} onClick={handleSubmit} className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 transition shadow-md disabled:bg-gray-400 disabled:shadow-none flex items-center gap-2">
                        {isSubmitted ? <><Lock size={16} /> Submitted</> : <><CheckCircle size={16} /> Submit Final Attendance</>}
                    </button>
                </div>
            </div>

            {/* Summary Card (4 stat boxes) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total Students', value: summary.total, color: 'text-gray-800', bg: 'bg-white' },
                    { label: 'Present', value: summary.present, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Absent', value: summary.absent, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Attendance %', value: `${summary.pct}%`, color: summary.pct >= 75 ? 'text-blue-600' : 'text-orange-600', bg: summary.pct >= 75 ? 'bg-blue-50' : 'bg-orange-50' },
                ].map(stat => (
                    <div key={stat.label} className={`${stat.bg} rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col gap-1`}>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                        <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Student Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Table Header with search */}
                <div className="p-4 px-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center gap-4 justify-between bg-gray-50">
                    <div>
                        <h2 className="font-bold text-gray-800">Student List — {year}{year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year Sec {section}</h2>
                        <p className="text-xs text-gray-500 mt-0.5">{subject} | {period} | {classType}</p>
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            className="w-full border pl-9 pr-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Search by name or roll no..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white border-b border-gray-100">
                            <tr>
                                <th className="p-4 px-6 font-semibold text-gray-600 text-sm uppercase tracking-wide">Roll Number</th>
                                <th className="p-4 px-6 font-semibold text-gray-600 text-sm uppercase tracking-wide">Student Name</th>
                                <th className="p-4 px-6 font-semibold text-gray-600 text-sm uppercase tracking-wide text-center">Status</th>
                                <th className="p-4 px-6 font-semibold text-gray-600 text-sm uppercase tracking-wide">Reason</th>
                                <th className="p-4 px-6 font-semibold text-gray-600 text-sm uppercase tracking-wide text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredStudents.map(s => (
                                <tr key={s.id} className={`hover:bg-gray-50 transition ${s.status === 'Absent' ? 'bg-red-50/30' : ''}`}>
                                    <td className="p-4 px-6 font-mono text-sm text-gray-600">{s.rollNumber}</td>
                                    <td className="p-4 px-6">
                                        <div className="font-medium text-gray-800">{s.name}</div>
                                        {s.overallAttendance < 75 && (
                                            <div className="flex items-center gap-1 text-orange-600 text-xs font-bold mt-0.5">
                                                <AlertTriangle size={12} /> Attendance Shortage ({s.overallAttendance}%)
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 px-6 text-center">
                                        {isSubmitted ? (
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${s.status === 'Present' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                    s.status === 'Late' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                                        s.status === 'OD' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                            'bg-red-100 text-red-700 border border-red-200'
                                                }`}>{s.status}</span>
                                        ) : (
                                            <select
                                                value={s.status}
                                                onChange={e => changeStatus(s.id, e.target.value as Student['status'])}
                                                className={`rounded-lg text-xs font-bold border px-2 py-1 outline-none focus:ring-2 focus:ring-blue-400 ${s.status === 'Present' ? 'bg-green-100 text-green-700 border-green-200' :
                                                        s.status === 'Late' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                                            s.status === 'OD' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                                'bg-red-100 text-red-700 border-red-200'
                                                    }`}
                                            >
                                                <option value="Present">Present</option>
                                                <option value="Absent">Absent</option>
                                                <option value="Late">Late</option>
                                                <option value="OD">OD</option>
                                            </select>
                                        )}
                                    </td>
                                    <td className="p-4 px-6">
                                        {s.status === 'Absent' || s.status === 'Late' ? (
                                            isSubmitted ? (
                                                <span className="text-sm text-gray-600">{s.reason || '—'}</span>
                                            ) : (
                                                <select
                                                    value={s.reason}
                                                    onChange={e => changeReason(s.id, e.target.value)}
                                                    className="border rounded-lg text-xs p-1.5 text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 w-36"
                                                >
                                                    <option value="">— Select Reason —</option>
                                                    <option value="Medical Leave">Medical Leave</option>
                                                    <option value="On Duty">On Duty</option>
                                                    <option value="Personal Leave">Personal Leave</option>
                                                    <option value="Unknown">Unknown</option>
                                                </select>
                                            )
                                        ) : (
                                            <span className="text-gray-300 text-sm">—</span>
                                        )}
                                    </td>
                                    <td className="p-4 px-6 text-right">
                                        {isSubmitted ? (
                                            <span className="text-gray-400 text-sm italic">Locked</span>
                                        ) : (
                                            <button
                                                onClick={() => changeStatus(s.id, s.status === 'Present' ? 'Absent' : 'Present')}
                                                className="text-blue-600 font-bold hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-md transition text-sm border border-blue-100"
                                            >
                                                Toggle
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredStudents.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No students match your search.</div>
                    )}
                </div>

                {/* Bottom Footer Summary */}
                <div className="border-t border-gray-100 px-6 py-3 bg-gray-50 flex justify-between items-center text-sm text-gray-600">
                    <span>Showing {filteredStudents.length} of {currentStudents.length} students</span>
                    <span>
                        <span className="font-bold text-green-700">{summary.present} Present</span>
                        {summary.late > 0 && <> · <span className="font-bold text-yellow-700">{summary.late} Late</span></>}
                        {' · '}<span className="font-bold text-red-700">{summary.absent} Absent</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
