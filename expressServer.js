const express = require('express');
const path = require('path');

const imageRoutes = require('./routes/imageRoutes');
const textRoutes = require('./routes/textRoutes');

const PORT = process.env.PORT || 8080;
const server = express();

// Middleware
server.use(express.json());
server.use(express.static(path.join(__dirname, 'public')));
server.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

server.use('/', imageRoutes);
server.use('/', textRoutes);

// index url
server.get('', (req, res) => {
    console.log('[Server] Response type:', res.constructor.name);
    console.log('[Server] res.status:', typeof res.status);

    res.status(200).send("Hello world!");
});

// Any endpoints that aren't defined
server.use((req, res) => {
    res.status(404).json("[Server] Page not found! Req-data:");
});

// Start listening
server.listen(PORT, '0.0.0.0', () => {
    console.log("[Server] Server is listening on port", PORT);
});