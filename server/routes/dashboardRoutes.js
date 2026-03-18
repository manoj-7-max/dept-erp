const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middlewares/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

// Multer Config for Documents
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `doc-${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /pdf|doc|docx|jpg|jpeg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Only PDF, DOC/DOCX, JPG, and PNG formats are allowed! (Max 5MB)');
        }
    }
});

// All routes require authentication
router.use(authMiddleware);

// Attendance Monitoring
router.get('/attendance', dashboardController.getAttendance);

// Mentoring Meetings
router.get('/meetings', dashboardController.getMeetings);

// Student Documents
router.get('/documents', dashboardController.getDocuments);
router.post('/documents', upload.single('documentFile'), dashboardController.uploadDocument);
router.delete('/documents/:id', dashboardController.deleteDocument);

// Student Goals
router.get('/goals', dashboardController.getGoals);
router.post('/goals', dashboardController.addGoal);

// Mentoring Feedback
router.post('/feedback', dashboardController.submitFeedback);

// Activity Timeline
router.get('/timeline', dashboardController.getTimeline);

// Dashboard Summary KPIs (Progress Summary Cards)
router.get('/summary', dashboardController.getDashboardSummary);

module.exports = router;
