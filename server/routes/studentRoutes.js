const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const protect = require('../middlewares/authMiddleware');

// Set up Multer for attachments
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /pdf|doc|docx|jpg|jpeg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Only PDF, DOCX, JPG, and PNG are allowed!');
        }
    }
});
const {
    getProfile,
    updateProfile,
    getMentor,
    getAcademicRecords,
    getParentDetails,
    getActivities,
    getBehaviour,
    getMentoringReports,
    createMentoringReport,
    scheduleMeeting,
    getMentorNotes,
    addMentorNote,
    getMentoringTasks,
    addMentoringTask,
    updateTaskStatus
} = require('../controllers/studentController');

router.route('/profile').get(protect, getProfile).put(protect, updateProfile);
router.get('/mentor', protect, getMentor);
router.get('/academic-records', protect, getAcademicRecords);
router.get('/parent-details', protect, getParentDetails);
router.get('/activities', protect, getActivities);
router.get('/behaviour', protect, getBehaviour);
router.get('/internal-marks', protect, getInternalMarks);

// Mount Sub-Routers to unify siloed APIs
router.use('/dashboard', require('./dashboardRoutes'));
router.use('/concerns', require('./concernRoutes'));

router.route('/mentoring-reports')
    .get(protect, getMentoringReports)
    .post(protect, upload.single('attachmentFile'), createMentoringReport);

router.post('/mentoring-meetings', protect, scheduleMeeting);

router.route('/mentor-notes')
    .get(protect, getMentorNotes)
    .post(protect, addMentorNote);

router.route('/mentoring-tasks')
    .get(protect, getMentoringTasks)
    .post(protect, addMentoringTask);

router.put('/mentoring-tasks/:id/status', protect, updateTaskStatus);

module.exports = router;
