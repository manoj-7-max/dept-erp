const Request = require('../models/Request');
const Attendance = require('../models/Attendance');
const InternalMark = require('../models/InternalMark');

exports.getStudentStats = async (req, res) => {
    try {
        const studentId = req.user.id;
        const totalClasses = await Attendance.countDocuments({ studentId });
        const presentClasses = await Attendance.countDocuments({ studentId, status: 'Present' });
        const attendancePercentage = totalClasses ? (presentClasses / totalClasses) * 100 : 0;

        const marks = await InternalMark.find({ studentId });

        res.json({
            attendance: attendancePercentage,
            marks
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.submitRequest = async (req, res) => {
    try {
        const { title, description, type, attachmentUrl } = req.body;

        const newRequest = new Request({
            title,
            description,
            type,
            submittedBy: req.user.id,
            attachmentUrl
        });

        await newRequest.save();
        res.json(newRequest);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getMyRequests = async (req, res) => {
    try {
        const requests = await Request.find({ submittedBy: req.user.id });
        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
