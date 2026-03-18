const Request = require('../models/Request');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
    try {
        const studentCount = await User.countDocuments({ role: 'student' });
        const facultyCount = await User.countDocuments({ role: 'faculty' });
        const pendingRequests = await Request.countDocuments({ status: 'Faculty_Approved' });

        res.json({
            studentCount,
            facultyCount,
            pendingRequests
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getPendingRequests = async (req, res) => {
    try {
        const requests = await Request.find({ status: 'Faculty_Approved' }).populate('studentId', 'name role department');
        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.approveRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body; // HOD_Approved or HOD_Rejected

        let request = await Request.findById(requestId);
        if (!request) return res.status(404).json({ msg: 'Request not found' });

        request.status = status;
        request.hodComments = req.body.comments;
        await request.save();

        res.json(request);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
