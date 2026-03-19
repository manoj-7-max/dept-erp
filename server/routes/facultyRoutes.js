const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { getStudents, markAttendance, verifyRequest, getPendingVerifications, saveInternalMarks, getMentees, getFacultyStats, scheduleMeeting } = require('../controllers/facultyController');

router.get('/students', auth, getStudents);
router.post('/attendance', auth, markAttendance);
router.post('/marks', auth, saveInternalMarks);
router.get('/mentees', auth, getMentees);
router.get('/stats', auth, getFacultyStats);
router.post('/mentoring/schedule', auth, scheduleMeeting);
router.put('/request/:requestId/verify', auth, verifyRequest);
router.get('/requests/pending', auth, getPendingVerifications);

module.exports = router;
