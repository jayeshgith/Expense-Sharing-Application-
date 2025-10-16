const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
router.post('/register', authCtrl.registerValidation, authCtrl.register);
router.post('/login', authCtrl.loginValidation, authCtrl.login);
module.exports = router;
