const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messageController');
const delay = require('../middlewares/delay');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// router.all('*', authMiddleware);
router.get('/:id', getMessages);
router.post('/send/:id', sendMessage);


module.exports = router;