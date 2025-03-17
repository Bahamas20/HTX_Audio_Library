const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/auth/login', userController.loginUser);

router.post('/users', userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/users/:user_id', userController.getUserById);
router.put('/users/:user_id', userController.updateUser);
router.delete('/users/:user_id', userController.deleteUser);

module.exports = router;
