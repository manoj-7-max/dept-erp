const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const protect = require('../middlewares/authMiddleware');

router.use(protect); // Ensure user is authenticated

router.get('/search', chatController.searchUsers);
router.get('/:userId', chatController.getMessages);
router.post('/send', chatController.sendMessage);

module.exports = router;