const express = require('express');
const { createUser, handleLogin, getUserList, getAccount, updateUser, deleteUser, updateUserByEmail, changePassword, getUserForSidebar } = require('../controllers/userController');
const delay = require('../middlewares/delay');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.all('*', authMiddleware);
router.post('/user/change-password', changePassword);
router.post('/register', createUser);
router.post('/login', handleLogin);
router.get('/user', getUserList);
router.get('/user-chat', getUserForSidebar);

router.put('/user/update/:id', updateUser);
router.put('/user/update_by_email/:email', updateUserByEmail);
router.delete('/user/delete/:id', deleteUser);

router.get('/account', getAccount);

module.exports = router;
