const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/User'); // Import User model
const { getDashboardStats, getPendingRequests, approveRequest } = require('../controllers/hodController');

// All routes here should be protected and HOD only
// Start with basic auth middleware. ideally add a role check middleware too.

router.get('/dashboard', auth, getDashboardStats);
router.get('/requests', auth, getPendingRequests);
router.put('/request/:requestId', auth, approveRequest);

// New Faculty Management Routes
router.get('/faculty', auth, async (req, res) => {
    try {
        const faculty = await User.find({ role: 'faculty' }).select('-password');
        res.json(faculty);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/faculty/:id', auth, async (req, res) => {
    try {
        const { name, designation, isDoctorate } = req.body;
        let faculty = await User.findById(req.params.id);
        if (!faculty) return res.status(404).json({ msg: 'Faculty not found' });

        // Update fields
        if (name) faculty.name = name;
        if (designation) faculty.designation = designation;
        if (isDoctorate !== undefined) faculty.isDoctorate = isDoctorate;

        await faculty.save();
        res.json(faculty);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete Faculty
router.delete('/faculty/:id', auth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Faculty removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
