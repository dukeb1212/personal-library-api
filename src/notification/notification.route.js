const express = require('express');
const router = express.Router();
const notificationController = require('./notification.controller');

//Add schedule route
router.post('/add', notificationController.addSchedule);

//Activate notification route
router.post('/activate', notificationController.activate);

//Delete notification route
router.delete('/delete', notificationController.delete);

//Delete all notifications route
router.delete('/delete/all', notificationController.deleteAll);

//Fetch notification data route
router.get('/fetch', notificationController.fetch);

module.exports = router;