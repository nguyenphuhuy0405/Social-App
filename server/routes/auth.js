const router = require('express').Router();
const AuthController = require('../controllers/auth-controller');

//register
router.post('/register', AuthController.register);

//login
router.post('/login', AuthController.login);

module.exports = router;
