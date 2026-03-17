const Student = require('../models/Student');
const Mentor = require('../models/Mentor');
const AcademicRecord = require('../models/AcademicRecord');
const ParentDetail = require('../models/ParentDetail');
const Activity = require('../models/Activity');
const Behaviour = require('../models/Behaviour');
const MentoringReport = require('../models/MentoringReport');
const MentoringMeeting = require('../models/MentoringMeeting');
const MentoringTask = require('../models/MentoringTask');
const MentorNote = require('../models/MentorNote');

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.student._id).select('-password');
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Update student phone, email, and home address
// @route   PUT /api/student/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const { phoneNumber, email, homeAddress } = req.body;
        const student = await Student.findById(req.student._id);

        if (student) {
            student.phoneNumber = phoneNumber || student.phoneNumber;
            student.email = email || student.email;
            student.homeAddress = homeAddress || student.homeAddress;
            const updatedStudent = await student.save();
            res.json({
                _id: updatedStudent._id,
                name: updatedStudent.name,
                email: updatedStudent.email,
                phoneNumber: updatedStudent.phoneNumber,
                homeAddress: updatedStudent.homeAddress
            });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Get assigned mentor
// @route   GET /api/student/mentor
// @access  Private
const getMentor = async (req, res) => {
    try {
        const student = await Student.findById(req.student._id).populate('mentorId');
        if (!student.mentorId) {
            return res.status(404).json({ message: 'Mentor not assigned' });
        }
        res.json(student.mentorId);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Get academic records
// @route   GET /api/student/academic-records
// @access  Private
const getAcademicRecords = async (req, res) => {
    try {
        const records = await AcademicRecord.find({ studentId: req.student._id }).sort({ semester: 1 });
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Get parent details
// @route   GET /api/student/parent-details
// @access  Private
const getParentDetails = async (req, res) => {
    try {
        const parentDetails = await ParentDetail.findOne({ studentId: req.student._id });
        res.json(parentDetails);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Get co-curricular activities
// @route   GET /api/student/activities
// @access  Private
const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find({ studentId: req.student._id });
        res.json(activities);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Get academic behaviour
// @route   GET /api/student/behaviour
// @access  Private
const getBehaviour = async (req, res) => {
    try {
        const behaviour = await Behaviour.findOne({ studentId: req.student._id });
        res.json(behaviour);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Get mentoring reports with optional filters
// @route   GET /api/student/mentoring-reports
// @access  Private
const getMentoringReports = async (req, res) => {
    try {
        const { semester, year, meetingMode, status } = req.query;
        let query = { studentId: req.student._id };

        if (semester) query.semester = semester;
        if (year) query.year = year;
        if (meetingMode) query.meetingMode = meetingMode;
        if (status) query.status = status;

        const reports = await MentoringReport.find(query).sort({ meetingDate: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Create a new mentoring report (Faculty role simulated)
// @route   POST /api/student/mentoring-reports
// @access  Private
const createMentoringReport = async (req, res) => {
    try {
        const {
            mentorName,
            meetingDate,
            meetingMode,
            semester,
            year,
            issuesIdentified,
            discussionSummary,
            actionPlan,
            status,
            nextMeetingDate
        } = req.body;

        const attachmentFile = req.file ? `/uploads/${req.file.filename}` : undefined;

        const newReport = new MentoringReport({
            studentId: req.student._id,
            mentorName,
            meetingDate,
            meetingMode,
            semester,
            year,
            issuesIdentified,
            discussionSummary,
            actionPlan,
            status: status || 'Completed',
            attachmentFile,
            nextMeetingDate
        });

        const savedReport = await newReport.save();
        res.status(201).json(savedReport);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Schedule a new mentor meeting
// @route   POST /api/student/mentoring-meetings
// @access  Private
const scheduleMeeting = async (req, res) => {
    try {
        const { mentorId, meetingDate, time, meetingMode, semester, agenda } = req.body;
        const newMeeting = new MentoringMeeting({
            studentId: req.student._id,
            mentorId,
            meetingDate,
            time,
            meetingMode,
            semester,
            agenda,
            status: 'Scheduled'
        });
        const savedMeeting = await newMeeting.save();
        res.status(201).json(savedMeeting);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Get mentor notes
// @route   GET /api/student/mentor-notes
// @access  Private
const getMentorNotes = async (req, res) => {
    try {
        const notes = await MentorNote.find({ studentId: req.student._id }).sort({ date: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Add a mentor note (simulating faculty behavior)
// @route   POST /api/student/mentor-notes
// @access  Private
const addMentorNote = async (req, res) => {
    try {
        const { mentorId, content } = req.body;
        const newNote = new MentorNote({
            studentId: req.student._id,
            mentorId,
            content
        });
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Get action items / mentoring tasks
// @route   GET /api/student/mentoring-tasks
// @access  Private
const getMentoringTasks = async (req, res) => {
    try {
        const tasks = await MentoringTask.find({ studentId: req.student._id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Add An Action Item / Task (Simulating Mentor assignment)
// @route   POST /api/student/mentoring-tasks
// @access  Private
const addMentoringTask = async (req, res) => {
    try {
        const { mentorId, description, dueDate, status } = req.body;
        const newTask = new MentoringTask({
            studentId: req.student._id,
            mentorId,
            description,
            dueDate,
            status: status || 'Pending'
        });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Update Mentoring Task Status
// @route   PUT /api/student/mentoring-tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await MentoringTask.findOneAndUpdate(
            { _id: req.params.id, studentId: req.student._id },
            { status },
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getMentor,
    getAcademicRecords,
    getParentDetails,
    getActivities,
    getBehaviour,
    getMentoringReports,
    createMentoringReport,
    scheduleMeeting,
    getMentorNotes,
    addMentorNote,
    getMentoringTasks,
    addMentoringTask,
    updateTaskStatus
};
