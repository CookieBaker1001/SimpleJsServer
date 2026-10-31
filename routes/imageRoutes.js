const express = require('express');
const server = express.Router();

const imageService = require('../services/imageService');

// GET endpoint for one random image
server.get('/image', (req, res) => {
    try {
        const imagePath = imageService.getRandomImagePath();

        if (!imagePath) {
            return res.status(404).send("Image not found.");
        }

        res.type('png').sendFile(imagePath);

    } catch (error) {
        console.error(error);
        res.status(404).send("Could not retrieve image..");
    }
});

// GET endpoint for fetching a specific image
server.get('/images/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const imagePath = imageService.getImagePath(filename);

        if (!imagePath) {
            return res.status(404).send("Image not found.");
        }

        res.type('png').sendFile(imagePath);
    } catch (error) {
        console.error(error);
        res.status(500).send('Could not retrieve image.');
    }
});

// GET endpoint for all images
server.get('/images', (req, res) => {
    try {
        const images = imageService.getAllImages();
        res.json(images);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not list images." });
    }
});

// POST endpoint
server.post('/images', express.raw({ type: ['image/png', 'application/octet-stream'], limit: '5mb' }), (req, res) => {
    try {
        const filename = imageService.saveImage(req.body);

        res.status(201).json({ message: 'Image uploaded successfully', filename });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

// PUT endpoint (renames an image)
server.put('/images/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const newName = req.body.text;

        const renamed = imageService.renameImage(filename, newName);

        if (!renamed) {
            return res.status(404).json({ error: 'Image not found.' });
        }

        res.json({ message: 'Image renamed.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not update image.' });
    }
});

// DELETE endpoint
server.delete('/images/:filename', (req, res) => {
    try {
        const deleted = imageService.deleteImage(req.params.filename);

        if (!deleted) {
            return res.status(404).json({ error: 'Image not found.' });
        }

        res.json({ message: 'Image deleted.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not delete image.' });
    }
});

module.exports = server;