const express = require('express');
const router = express.Router();
const { createRequest, updateRequestStatus, getRequests } = require('../controllers/requestController');

router.post('/', createRequest);
router.put('/:id/status', updateRequestStatus);
router.get('/', getRequests);

module.exports = router;