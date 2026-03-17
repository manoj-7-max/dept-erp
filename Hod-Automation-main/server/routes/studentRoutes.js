const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getStudentStats, submitRequest, getMyRequests } = require('../controllers/studentController');

router.get('/stats', auth, getStudentStats);
router.post('/request', auth, submitRequest);
router.get('/requests', auth, getMyRequests);

module.exports = router;
