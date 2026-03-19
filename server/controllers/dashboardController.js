const Attendance = require('../models/Attendance');
const MentoringMeeting = require('../models/MentoringMeeting');
const StudentDocument = require('../models/StudentDocument');
const StudentGoal = require('../models/StudentGoal');
const MentoringFeedback = require('../models/MentoringFeedback');
const TimelineEvent = require('../models/TimelineEvent');
const Student = require('../models/Student');
const AcademicRecord = require('../models/AcademicRecord');
const Activity = require('../models/Activity');

// Get Attendance
exports.getAttendance = async (req, res) => {
    try {
        const studentId = req.student._id;
        const regNo = req.student.registerNumber;
        const attendance = await Attendance.find({
            $or: [{ studentId }, { regNo }]
        });
        res.json(attendance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Mentoring Meetings
exports.getMeetings = async (req, res) => {
    try {
        const studentId = req.student._id;
        const regNo = req.student.registerNumber;
        const meetings = await MentoringMeeting.find({
            $or: [{ studentId }, { regNo }]
        }).sort({ meetingDate: -1 });
        res.json(meetings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Documents
exports.getDocuments = async (req, res) => {
    try {
        const documents = await StudentDocument.find({ studentId: req.student.id }).sort({ uploadDate: -1 });
        res.json(documents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Document Upload
exports.uploadDocument = async (req, res) => {
    try {
        const { documentName, category, description } = req.body;

        if (!documentName || !category) {
            return res.status(400).json({ msg: 'Please provide document name and category' });
        }

        if (!req.file) {
            return res.status(400).json({ msg: 'Please upload a valid file' });
        }

        const newDoc = new StudentDocument({
            studentId: req.student.id,
            documentName,
            category,
            description,
            fileUrl: `/uploads/${req.file.filename}`, // Actual saved Multer file path
            fileType: req.file.mimetype,
            status: 'Pending Review'
        });

        await newDoc.save();
        res.status(201).json(newDoc);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete Document
exports.deleteDocument = async (req, res) => {
    try {
        const document = await StudentDocument.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ msg: 'Document not found' });
        }

        // Make sure user owns document
        if (document.studentId.toString() !== req.student.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await document.remove();
        res.json({ msg: 'Document removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Document not found' });
        }
        res.status(500).send('Server Error');
    }
};

// Get Goals
exports.getGoals = async (req, res) => {
    try {
        const goals = await StudentGoal.find({ studentId: req.student.id }).sort({ createdAt: -1 });
        res.json(goals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Add/Update Goal
exports.addGoal = async (req, res) => {
    try {
        const { careerInterest, skillsToDevelop, targetCompaniesOrUniversities } = req.body;

        const newGoal = new StudentGoal({
            studentId: req.student.id,
            careerInterest,
            skillsToDevelop: Array.isArray(skillsToDevelop) ? skillsToDevelop : skillsToDevelop.split(',').map(s => s.trim()),
            targetCompaniesOrUniversities: Array.isArray(targetCompaniesOrUniversities) ? targetCompaniesOrUniversities : targetCompaniesOrUniversities.split(',').map(s => s.trim())
        });

        const goal = await newGoal.save();
        res.json(goal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Submit Mentoring Feedback
exports.submitFeedback = async (req, res) => {
    try {
        const { meetingId, rating, feedbackComments, suggestions } = req.body;

        // Ensure meeting exists and belongs to student
        const meeting = await MentoringMeeting.findOne({ _id: meetingId, studentId: req.student.id });
        if (!meeting) {
            return res.status(404).json({ msg: 'Meeting not found' });
        }

        const newFeedback = new MentoringFeedback({
            studentId: req.student.id,
            meetingId,
            rating,
            feedbackComments,
            suggestions
        });

        const feedback = await newFeedback.save();
        res.json(feedback);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Activity Timeline
exports.getTimeline = async (req, res) => {
    try {
        const timelineEvents = await TimelineEvent.find({ studentId: req.student.id }).sort({ date: -1 });
        res.json(timelineEvents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Dashboard Summary / KPIs
exports.getDashboardSummary = async (req, res) => {
    try {
        const studentId = req.student._id;
        const regNo = req.student.registerNumber;

        // 1. Calculate Attendance %
        const attendanceRecords = await Attendance.find({ 
            $or: [{ studentId }, { regNo }] 
        });
        
        let totalClasses = 0;
        let classesAttended = 0;
        attendanceRecords.forEach(record => {
            totalClasses += record.totalClasses;
            classesAttended += record.classesAttended;
        });
        const attendancePercentage = totalClasses > 0 ? ((classesAttended / totalClasses) * 100).toFixed(1) : 0;

        // 2. CGPA & Backlogs logic
        const academicRecords = await InternalMark.find({ studentId });
        let cgpa = 8.5; // Default placeholder for CGPA calculation
        let backlogs = 0;

        // 3. Co-curricular Count
        const activitiesCount = await Activity.countDocuments({ 
            $or: [{ studentId }, { regNo }] 
        });

        // 4. Total Mentor Meetings
        const meetingsCount = await MentoringMeeting.countDocuments({ 
            $or: [{ studentId }, { regNo }] 
        });

        res.json({
            cgpa,
            attendancePercentage: parseFloat(attendancePercentage),
            backlogs,
            activitiesCount,
            meetingsCount
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
