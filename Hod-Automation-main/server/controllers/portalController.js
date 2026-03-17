const Complaint = require('../models/Complaint');
const Circular = require('../models/Circular');
const Resource = require('../models/Resource');

// In-memory array to simulate DB for complaints
let mockComplaints = [
    {
        _id: '1', staffId: 'FAC001', name: 'Prof. John Doe', department: 'CSE', designation: 'Assistant Professor', title: 'Leaking AC', description: 'AC is leaking water on the lab computers.', category: 'Infrastructure', priority: 'High', location: 'Lab 2', status: 'Pending', type: 'Staff Complaint',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        comments: [],
        submittedBy: { name: 'Prof. John Doe', role: 'faculty' }
    },
    {
        _id: '2', registerNumber: 'REG10045', name: 'Alex Johnson', department: 'CSE', yearSection: 'III Year / B Sec', title: 'More books needed in library', description: 'The library needs more copies of "Introduction to Algorithms". Most of the time they are successfully issued out so there are none available.', category: 'Academic Issue', priority: 'Medium', type: 'Student Feedback', isAnonymous: false, status: 'Pending',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        comments: [],
        submittedBy: { name: 'Alex Johnson', role: 'student' }
    },
    {
        _id: '3', registerNumber: 'REG10099', name: 'Anonymous', department: 'ECE', yearSection: 'IV Year / A Sec', title: 'Network instability in Block C', description: 'Wi-Fi keeps dropping randomly during our lab hours. This affects our online assignments.', category: 'Infrastructure', priority: 'High', type: 'Student Feedback', isAnonymous: true, status: 'Under Review',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        comments: [{ text: 'We have contacted the IT department to check the routers in Block C.', date: new Date().toISOString() }],
        submittedBy: { name: 'Anonymous', role: 'student' }
    },
    {
        _id: '4', registerNumber: 'REG10234', name: 'Samantha Smith', department: 'MECH', yearSection: 'II Year / C Sec', title: 'Quality of Food in Canteen', description: 'The hygiene in the canteen could be better. Also, please add more vegetarian options.', category: 'General Feedback', priority: 'Low', type: 'Student Feedback', isAnonymous: false, status: 'Resolved',
        createdAt: new Date(Date.now() - 432000000).toISOString(),
        comments: [{ text: 'Forwarded to the catering committee. They have promised to improve options starting next week.', date: new Date(Date.now() - 345600000).toISOString() }],
        submittedBy: { name: 'Samantha Smith', role: 'student' }
    }
];

// ---- Complaint Logic ----
exports.submitComplaint = async (req, res) => {
    try {
        const { staffId, name, department, designation, title, category, priority, location, description, date, type, registerNumber, yearSection, isAnonymous } = req.body;
        const newComplaint = {
            _id: Math.random().toString(36).substring(7),
            staffId, name, department, designation, title, category, priority, location, description,
            type: type || 'Staff Complaint',
            registerNumber, yearSection, isAnonymous,
            status: 'Pending',
            createdAt: date || new Date().toISOString(),
            comments: [],
            submittedBy: { name: isAnonymous ? 'Anonymous' : (name || 'Anonymous'), role: req.user.role }
        };
        mockComplaints.push(newComplaint);
        res.json(newComplaint);
    } catch (err) { res.status(500).send('Server Error'); }
};

exports.getComplaints = async (req, res) => {
    try {
        const { status, category, type } = req.query;
        let filteredComplaints = [...mockComplaints];

        // Ensure HOD sees all complaints, and faculty/student sees their own
        if (req.user.role === 'faculty' || req.user.role === 'student') {
            filteredComplaints = mockComplaints.filter(c => c.submittedBy.role === req.user.role);
        }

        if (status) filteredComplaints = filteredComplaints.filter(c => c.status === status);
        if (category) filteredComplaints = filteredComplaints.filter(c => c.category === category);
        if (type) filteredComplaints = filteredComplaints.filter(c => c.type === type);

        res.json(filteredComplaints);
    } catch (err) { res.status(500).send('Server Error'); }
};

exports.updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params; // Complaint ID
        const { status, assignedTo, newComment } = req.body; // Update fields

        if (req.user.role !== 'hod') return res.status(403).json({ msg: 'Unauthorized' });

        const complaintIndex = mockComplaints.findIndex(c => c._id === id);
        if (complaintIndex === -1) return res.status(404).json({ msg: 'Complaint not found' });

        if (status) mockComplaints[complaintIndex].status = status;
        if (assignedTo) mockComplaints[complaintIndex].assignedTo = assignedTo;
        if (newComment) {
            mockComplaints[complaintIndex].comments = mockComplaints[complaintIndex].comments || [];
            mockComplaints[complaintIndex].comments.push({ text: newComment, date: new Date().toISOString() });
        }

        res.json(mockComplaints[complaintIndex]);
    } catch (err) { res.status(500).send('Server Error'); }
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
