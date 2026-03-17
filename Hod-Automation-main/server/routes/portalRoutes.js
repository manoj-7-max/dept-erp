const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Protect routes
const {
    submitComplaint, getComplaints, updateComplaintStatus,
    postCircular, getCirculars,
    uploadResource, getResources
} = require('../controllers/portalController');

// Complaints
router.post('/complaint', auth, submitComplaint);
router.get('/complaints', auth, getComplaints);
router.put('/complaint/:id', auth, updateComplaintStatus); // HOD only check inside controller

// Circulars
router.post('/circular', auth, postCircular);
router.get('/circulars', auth, getCirculars); // Can be public? Controller handles logic if req.user exists, but middleware enforced here. Ideally middleware should be optional for public.
// For public circulars, we might need a separate route or optional auth middleware.

// Resources
router.post('/resource', auth, uploadResource);
router.get('/resources', auth, getResources);

module.exports = router;
