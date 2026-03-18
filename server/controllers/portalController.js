const Complaint = require('../models/Complaint');
const Circular = require('../models/Circular');
const Resource = require('../models/Resource');

// ---- Complaint Logic ----
exports.submitComplaint = async (req, res) => {
    try {
        const { name, isAnonymous } = req.body;
        const newComplaint = new Complaint({
            ...req.body,
            submittedBy: {
                id: req.user.id,
                name: isAnonymous ? 'Anonymous' : name,
                role: req.user.role
            },
            status: 'Pending',
        });
        await newComplaint.save();
        res.status(201).json(newComplaint);
    } catch (err) {
        console.error('Error submitting complaint:', err);
        res.status(500).send('Server Error');
    }
};

exports.getComplaints = async (req, res) => {
    try {
        const { status, category, type } = req.query;
        let query = {};

        // HOD sees all, others see their own department or personal complaints
        if (req.user.role === 'faculty') {
            query = {
                $or: [
                    { 'submittedBy.id': req.user.id },
                    { department: req.user.department }
                ]
            };
        } else if (req.user.role === 'student') {
            query['submittedBy.id'] = req.user.id;
        }

        if (status) query.status = status;
        if (category) query.category = category;
        if (type) query.type = type;

        const complaints = await Complaint.find(query).sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        console.error('Error fetching complaints:', err);
        res.status(500).send('Server Error');
    }
};

exports.updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params; // Complaint ID
        const { status, assignedTo, newComment } = req.body; // Update fields

        if (req.user.role !== 'hod') return res.status(403).json({ msg: 'Unauthorized' });

        const complaint = await Complaint.findById(id);
        if (!complaint) return res.status(404).json({ msg: 'Complaint not found' });

        if (status) complaint.status = status;
        if (assignedTo) complaint.assignedTo = assignedTo;
        if (newComment) {
            complaint.comments.push({
                text: newComment,
                author: req.user.id,
                date: new Date()
            });
        }

        await complaint.save();
        res.json(complaint);
    } catch (err) {
        console.error('Error updating complaint:', err);
        res.status(500).send('Server Error');
    }
};


// ---- Circular Logic ----
exports.postCircular = async (req, res) => {
    try {
        const { title, content, audience, isPublic, attachmentUrl } = req.body;
        if (req.user.role !== 'hod' && req.user.role !== 'faculty') return res.status(403).json({ msg: 'Unauthorized' });

        const circular = new Circular({
            title, content, audience, isPublic, attachmentUrl,
            postedBy: req.user.id
        });
        await circular.save();
        res.json(circular);
    } catch (err) { res.status(500).send('Server Error'); }
};

exports.getCirculars = async (req, res) => {
    try {
        // Public circulars if no auth, otherwise role-based
        let query = { isPublic: true };

        // If logged in, fetch relevant circulars
        if (req.user) {
            query = {
                $or: [
                    { isPublic: true },
                    { audience: 'ALL' },
                    { audience: req.user.role.toUpperCase() }
                ]
            };
        }

        const circulars = await Circular.find(query).sort({ createdAt: -1 }).populate('postedBy', 'name role');
        res.json(circulars);
    } catch (err) { res.status(500).send('Server Error'); }
};


// ---- Resource Logic ----
exports.uploadResource = async (req, res) => {
    try {
        const { title, description, type, subject, year, semester, url } = req.body;
        if (req.user.role === 'student') return res.status(403).json({ msg: 'Unauthorized' }); // Only Staff/HOD

        const resource = new Resource({
            title, description, type, subject, year, semester, url,
            uploadedBy: req.user.id
        });
        await resource.save();
        res.json(resource);
    } catch (err) { res.status(500).send('Server Error'); }
};

exports.getResources = async (req, res) => {
    try {
        const { subject, year, semester, type } = req.query;
        let query = {};
        if (subject) query.subject = subject;
        if (year) query.year = year;
        if (semester) query.semester = semester;
        if (type) query.type = type;

        const resources = await Resource.find(query).populate('uploadedBy', 'name');
        res.json(resources);
    } catch (err) { res.status(500).send('Server Error'); }
};
