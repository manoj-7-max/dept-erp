const express = require('express');
const router = express.Router();
const Circular = require('../models/Circular');

// Get all circulars
router.get('/', async (req, res) => {
    try {
        const circulars = await Circular.find().sort({ posted_date: -1 });
        res.json(circulars);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create a circular
router.post('/', async (req, res) => {
    try {
        const { title, category, description, event_date, deadline, location, organizer, attachment_file, registration_link, posted_by } = req.body;

        const newCircular = new Circular({
            title, category, description, event_date, deadline, location, organizer, attachment_file, registration_link, posted_by
        });

        const circular = await newCircular.save();

        // Real-time synchronization across dashboards
        if (req.io) {
            req.io.emit('new_circular', circular); // Update dashboards globally
            req.io.emit('notification', {          // Cascade generic notifications
                title: 'New Circular Posted',
                message: `${title} (${category})`,
                type: 'System'
            });
        }

        res.json(circular);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
