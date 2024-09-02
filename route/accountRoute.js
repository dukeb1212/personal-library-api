const express = require('express');
const router = express.Router();
const accountController = require('../controller/accountController');

//Register route
router.post('/register', accountController.register);

module.exports = router;