const express = require('express')
const app = express()
const port = 8888

// Route modules
const accountRoute = require('./src/account/account.route');
const bookRoute = require('./src/book/book.route');
const notificationRoute = require('./src/notification/notification.route');

// Middleware for JSON body
app.use(express.json());

// Middleware for monitoring request
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    console.log('Request Body:', req.body);
    next();
});


// Account Route
app.use('/api/account', accountRoute);

// Book Route
app.use('/api/book', bookRoute);

// Notification Route
app.use('/api/notification', notificationRoute);

// Health check
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Service is up and running',
        uptime: process.uptime(),  // Uptime in seconds
        timestamp: new Date(),
    });
});

// Start Server
app.listen(port, () => console.log(`API Server running on port ${port}!`))