const Request = require('../models/Request');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
    try {
        const studentCount = 120;
        const facultyCount = 15;
        const pendingRequests = 5;

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
        const requests = [
            { _id: '1', status: 'VERIFIED', submittedBy: { name: 'Jane Student', role: 'student', department: 'CSE' } },
            { _id: '2', status: 'PENDING', submittedBy: { name: 'Prof. John Doe', role: 'faculty', department: 'CSE' } }
        ];

        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.approveRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body; // APPROVED or REJECTED

        let request = await Request.findById(requestId);
        if (!request) return res.status(404).json({ msg: 'Request not found' });

        request.status = status;
        request.approvedBy = req.user.id;
        await request.save();

        res.json(request);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
