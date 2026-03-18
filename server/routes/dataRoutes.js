const express = require('express');
const router = express.Router();
const multer = require('multer');
const { importCsv, getStudents, getAttendance, getHodAnalytics } = require('../controllers/dataController');

const upload = multer({ dest: 'uploads/' });

router.post('/import-csv', upload.single('file'), importCsv);
router.get('/students', getStudents);
router.get('/attendance', getAttendance);
router.get('/hod/analytics', getHodAnalytics);

module.exports = router;
