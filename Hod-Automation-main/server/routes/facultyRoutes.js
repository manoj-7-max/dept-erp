const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getStudents, markAttendance, verifyRequest, getPendingVerifications } = require('../controllers/facultyController');

router.get('/students', auth, getStudents);
router.post('/attendance', auth, markAttendance);
router.put('/request/:requestId/verify', auth, verifyRequest);
router.get('/requests/pending', auth, getPendingVerifications);

module.exports = router;
