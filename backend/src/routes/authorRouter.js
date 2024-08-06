const express = require('express');
const { createAuthor, getAuthorList, updateAuthor, deleteAuthor } = require('../controllers/authorController');
const delay = require('../middlewares/delay');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.all('*', authMiddleware);
router.post('/create', createAuthor);
router.get('/list', getAuthorList);
router.put('/update/:id', updateAuthor);
router.delete('/delete/:id', deleteAuthor);

module.exports = router;