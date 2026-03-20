const Request = require('../models/Request');
const Attendance = require('../models/Attendance');
const InternalMark = require('../models/InternalMark');
const User = require('../models/User');

exports.getStudents = async (req, res) => {
    try {
        const { section } = req.query;
        let query = {};
        if (section) query.section = section;
        
        const studentsFromUsers = await User.find({ role: 'student', ...query }).select('-password').lean();
        
        // Also fetch from legacy Student collection to unify siloed data
        const Student = require('../models/Student');
        const legacyStudents = await Student.find(query).select('-password').lean();
        
        // Merge them
        const students = [...studentsFromUsers, ...legacyStudents];
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

exports.saveInternalMarks = async (req, res) => {
    try {
        const { subject, examType, marksData } = req.body; // marksData: [{ studentId, marks, totalMarks }]

        const marksRecords = marksData.map(m => ({
            studentId: m.studentId,
            subject,
            examType,
            marks: m.marks,
            totalMarks: m.totalMarks || 100,
            facultyId: req.user.id
        }));

        await InternalMark.insertMany(marksRecords);
        res.json({ msg: 'Marks saved successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.verifyRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body; // Should be Faculty_Approved or Faculty_Rejected

        // Only allow verifying Pending requests
        let request = await Request.findById(requestId);
        if (!request) return res.status(404).json({ msg: 'Request not found' });

        if (request.status !== 'Pending') return res.status(400).json({ msg: 'Request already processed' });

        request.status = status;
        request.facultyComments = req.body.comments;
        await request.save();

        res.json(request);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getPendingVerifications = async (req, res) => {
    try {
        // Faculty sees Pending requests from Students
        const studentRequests = await Request.find({ status: 'Pending' }).populate('studentId', 'name role department');
        res.json(studentRequests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getMentees = async (req, res) => {
    try {
        const menteesFromUsers = await User.find({ role: 'student', mentorId: req.user.id }).select('-password').lean();
        
        const Student = require('../models/Student');
        const menteesFromLegacy = await Student.find({ mentorId: req.user.id }).select('-password').lean();
        
        const mentees = [...menteesFromUsers, ...menteesFromLegacy];
        res.json(mentees);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getFacultyStats = async (req, res) => {
    try {
        const menteesCount = await User.countDocuments({ role: 'student', mentorId: req.user.id });
        const pendingRequests = await Request.countDocuments({ status: 'Pending' });
        
        // Mocking some stats for now as some models like LessonPlan might not exist yet
        res.json({
            menteesCount,
            subjectCount: 4, // Placeholder
            lessonPlanCompletion: '75%',
            pendingRequests,
            researchPapers: 3
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.scheduleMeeting = async (req, res) => {
    try {
        const { studentId, meetingDate, meetingTime, meetingMode, description } = req.body;
        const MentoringMeeting = require('../models/MentoringMeeting');

        const meeting = new MentoringMeeting({
            studentId,
            mentorId: req.user.id,
            meetingDate,
            meetingTime,
            meetingMode,
            description,
            status: 'Scheduled'
        });

        await meeting.save();

        // Emit real-time notification to student
        const io = req.io; // Use the injected io from middleware
        if (io) {
            io.to(studentId.toString()).emit('notification', {
                type: 'MENTORING_MEETING',
                title: 'New Mentoring Meeting Scheduled',
                message: `Your mentor has scheduled a meeting on ${new Date(meetingDate).toLocaleDateString()} at ${meetingTime}.`,
                date: new Date().toISOString()
            });
        }

        res.json(meeting);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
