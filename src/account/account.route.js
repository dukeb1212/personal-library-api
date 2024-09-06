const express = require('express');
const router = express.Router();
const accountController = require('./account.controller');
const accountMiddleware = require('./account.middleware')
const isAuth = accountMiddleware.isAuth;

//Register route
router.post('/register', accountController.register);

//Login route
router.post('/login', accountController.login);

//Refresh token route
router.post('/refresh', accountController.refreshToken);

//Get user profile data
router.get('/profile', isAuth, async (req, res) => {
    res.json({
        success: true,
        userData: req.userData
    })
})

//FCM Token route
router.post('/fcm', accountController.updateFCMToken);

module.exports = router;