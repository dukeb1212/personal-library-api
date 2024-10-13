const express = require('express');
const router = express.Router();
const bookController = require('./book.controller');
const accountMiddleware = require('../account/account.middleware');
const isAuth = accountMiddleware.isAuth;

// Sync book from server to local route
router.get('/sync', isAuth, bookController.syncServerToLocal);

module.exports = router;