const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const protect = require('../middlewares/authMiddleware');
const { getConcerns, submitConcern, getFacultyList } = require('../controllers/concernController');

// Set up Multer for concern attachments
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `concern-${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /pdf|doc|docx|jpg|jpeg|png|webm|wav|mp3/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: File type not supported!');
        }
    }
});

// Generic concerns router (Note: this is usually mounted at /api/student/concerns in server.js)
router.route('/')
    .get(protect, getConcerns)
    .post(protect, upload.fields([
        { name: 'attachmentFile', maxCount: 1 },
        { name: 'voiceFile', maxCount: 1 }
    ]), submitConcern);

// Faculty list router (Note: this will be mounted at /api/student/concerns/faculty-list in server.js)
router.get('/faculty-list', protect, getFacultyList);

module.exports = router;
