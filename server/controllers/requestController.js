const Request = require('../models/Request');
const Notification = require('../models/Notification');

// 1. Student creates a request
exports.createRequest = async (req, res) => {
    try {
        const { studentId, facultyId, type, title, description, startDate, endDate } = req.body;

        const newRequest = await Request.create({
            studentId, type, title, description, startDate, endDate, status: 'Pending'
        });

        // Notify the assigned Faculty
        if (facultyId) {
            const notification = await Notification.create({
                recipientId: facultyId,
                senderId: studentId,
                title: 'New Student Request',
                message: `${title} requires your approval.`,
                type: 'Request_Created'
            });
            // Real-time Push
            req.io.to(facultyId.toString()).emit('notification', notification);
            req.io.to(facultyId.toString()).emit('request_updated', newRequest);
        }

        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Faculty / HOD updates the request (Multi-level approval logic)
exports.updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, comments, approverRole, approverId } = req.body;

        const request = await Request.findById(id);
        if (!request) return res.status(404).json({ error: 'Request not found' });

        // Update workflow state machine based on role
        request.status = status;
        if (approverRole === 'faculty') request.facultyComments = comments;
        if (approverRole === 'hod') request.hodComments = comments;

        await request.save();

        // Notify Student of the update
        const notification = await Notification.create({
            recipientId: request.studentId,
            senderId: approverId,
            title: `Request ${status.replace('_', ' ')}`,
            message: `Your request "${request.title}" was updated.`,
            type: status.includes('Approved') ? 'Request_Approved' : 'Request_Rejected'
        });

        req.io.to(request.studentId.toString()).emit('notification', notification);

        // Escalation Logic: If Faculty approved, notify HODs automatically
        if (status === 'Faculty_Approved') {
            req.io.to('hod').emit('notification', {
                title: 'Escalated Request',
                message: `A ${request.type} request was approved by faculty and awaits final HOD approval.`,
                type: 'Alert'
            });
        }

        // Broadcast universal update
        req.io.emit('request_updated', request);

        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Fetch requests based on role contexts
exports.getRequests = async (req, res) => {
    try {
        const { role, userId } = req.query; // Passed from frontend unified api
        let filter = {};

        if (role === 'student') filter = { studentId: userId };
        if (role === 'faculty') filter = { status: 'Pending' }; // Or match by mapped students
        if (role === 'hod') filter = { status: 'Faculty_Approved' }; // HOD only sees faculty-approved

        const requests = await Request.find(filter).populate('studentId', 'name registerNumber department').sort({ createdAt: -1 });

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};