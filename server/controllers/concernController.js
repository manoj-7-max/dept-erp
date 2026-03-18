const Concern = require('../models/Concern');
const Mentor = require('../models/Mentor');

// @desc    Get student concerns
// @route   GET /api/student/concerns
// @access  Private
const getConcerns = async (req, res) => {
    try {
        const concerns = await Concern.find({ studentId: req.student._id })
            .populate('recipientId', 'name designation')
            .sort({ submittedAt: -1 });
        res.json(concerns);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Submit a new concern
// @route   POST /api/student/concerns
// @access  Private
const submitConcern = async (req, res) => {
    try {
        const { title, description, concernType, priority, recipientType, recipientId } = req.body;

        if (!title || !description || !concernType || !recipientType) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if (recipientType === 'Faculty' && !recipientId) {
            return res.status(400).json({ message: 'Please select a specific faculty member' });
        }

        const attachmentFile = req.files?.attachmentFile?.[0] ? `/uploads/${req.files.attachmentFile[0].filename}` : undefined;
        const voiceFile = req.files?.voiceFile?.[0] ? `/uploads/${req.files.voiceFile[0].filename}` : undefined;

        const concern = new Concern({
            studentId: req.student._id,
            title,
            description,
            concernType,
            priority: priority || 'Medium',
            recipientType,
            recipientId: recipientType === 'Faculty' ? recipientId : undefined,
            status: 'Pending',
            attachmentFile,
            voiceFile
        });

        const createdConcern = await concern.save();
        res.status(201).json(createdConcern);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Get list of all faculty members (mentors)
// @route   GET /api/student/faculty-list
// @access  Private
const getFacultyList = async (req, res) => {
    try {
        const faculty = await Mentor.find({}, 'name designation department');
        res.json(faculty);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
    getConcerns,
    submitConcern,
    getFacultyList
};
