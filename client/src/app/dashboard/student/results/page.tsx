"use client";

export default function StudentResults() {
    const results = [
        { subject: "Data Structures", code: "CS101", cia1: 18, cia2: 19, model: 88, grade: "A+" },
        { subject: "Operating Systems", code: "CS102", cia1: 15, cia2: 17, model: 76, grade: "A" },
        { subject: "Database Mgmt", code: "CS103", cia1: 12, cia2: 16, model: 65, grade: "B+" },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Academic Performance</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-blue-50 border-b">
                        <tr>
                            <th className="p-4 font-bold text-blue-900">Subject Code</th>
                            <th className="p-4 font-bold text-blue-900">Subject Name</th>
                            <th className="p-4 font-bold text-blue-900">CIA 1</th>
                            <th className="p-4 font-bold text-blue-900">CIA 2</th>
                            <th className="p-4 font-bold text-blue-900">Model Exam</th>
                            <th className="p-4 font-bold text-blue-900">Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((res, idx) => (
                            <tr key={idx} className="border-b hover:bg-blue-50">
                                <td className="p-4 font-mono text-sm">{res.code}</td>
                                <td className="p-4 font-medium">{res.subject}</td>
                                <td className="p-4">{res.cia1}/20</td>
                                <td className="p-4">{res.cia2}/20</td>
                                <td className="p-4">{res.model}/100</td>
                                <td className="p-4 font-bold text-green-600">{res.grade}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
                <p className="font-bold">Note:</p>
                <p>If you have any discrepancies in the marks, please submit a "Marks Update" request to your faculty via the request portal.</p>
            </div>
        </div>
    );
}
