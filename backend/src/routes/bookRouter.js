const express = require('express');
const { createBook, getBookList, updateBook, deleteBook } = require('../controllers/bookController');
const delay = require('../middlewares/delay');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.all('*', authMiddleware);
router.post('/create', createBook);
router.get('/list', getBookList);
router.put('/update/:id', updateBook);
router.delete('/delete/:id', deleteBook);

module.exports = router;