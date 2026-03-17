const Request = require('../models/Request');
const Attendance = require('../models/Attendance');
const InternalMark = require('../models/InternalMark');
const User = require('../models/User');

exports.getStudents = async (req, res) => {
    try {
        const students = [
            { _id: 'mock-s1', name: 'Jane Student', email: 'student@college.edu', rollNumber: 'CSE2024001', batch: '2024-2028' },
            { _id: 'mock-s2', name: 'John Smith', email: 'john@college.edu', rollNumber: 'CSE2024002', batch: '2024-2028' }
        ];

        res.json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.markAttendance = async (req, res) => {
    try {
        const { date, subject, students } = req.body; // students: [{ studentId, status }]

        const attendanceRecords = students.map(s => ({
            date,
            subject,
            studentId: s.studentId,
            status: s.status,
            facultyId: req.user.id
        }));

        await Attendance.insertMany(attendanceRecords);
        res.json({ msg: 'Attendance marked successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.verifyRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body; // Should be VERIFIED or REJECTED

        // Only allow verifying PENDING requests
        let request = await Request.findById(requestId);
        if (!request) return res.status(404).json({ msg: 'Request not found' });

        if (request.status !== 'PENDING') return res.status(400).json({ msg: 'Request already processed' });

        request.status = status;
        request.verifiedBy = req.user.id;
        await request.save();

        res.json(request);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getPendingVerifications = async (req, res) => {
    try {
        // Faculty sees PENDING requests from Students
        // Need to filter by department ideally, but for now show all PENDING student requests

        const studentRequests = [
            { _id: 'mock-req-1', status: 'PENDING', submittedBy: { name: 'Jane Student', role: 'student', department: 'CSE' }, type: 'LEAVE', reason: 'Medical Checkup' },
            { _id: 'mock-req-2', status: 'PENDING', submittedBy: { name: 'John Smith', role: 'student', department: 'CSE' }, type: 'BONAFIDE', reason: 'Scholarship Application' }
        ];

        res.json(studentRequests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
