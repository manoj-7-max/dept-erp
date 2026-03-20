const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const Circular = require('../models/Circular');

// Get all circulars with audience filters
router.get('/', auth, async (req, res) => {
    try {
        let query = { isPublic: true };
        if (req.user) {
            query = {
                $or: [
                    { isPublic: true },
                    { audience: 'ALL' },
                    { audience: req.user.role.toUpperCase() }
                ]
            };
        }
        const circulars = await Circular.find(query).sort({ posted_date: -1 }).populate('posted_by', 'name role');
        res.json(circulars);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create a circular (Staff/HOD only)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role === 'student') {
            return res.status(403).json({ msg: 'Not authorized to post circulars' });
        }

        const { 
            title, category, description, content, audience, isPublic, 
            event_date, deadline, location, organizer, attachment_url, registration_link 
        } = req.body;

        const newCircular = new Circular({
            title, category, description, content, audience, isPublic, 
            event_date, deadline, location, organizer, attachment_url, registration_link,
            posted_by: req.user.id
        });

        const circular = await newCircular.save();

        // Real-time synchronization across targeted audience dashboards
        const io = req.app.get('io');
        if (io) {
            const targetRoom = audience === 'ALL' ? 'ALL' : audience; // Room naming convention
            io.to(targetRoom).emit('new_circular', circular); 
            
            io.to(targetRoom).emit('notification', {
                type: 'CIRCULAR',
                title: 'New Circular Posted',
                message: `${title} - ${category}`,
                date: new Date().toISOString()
            });
        }

        res.json(circular);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
