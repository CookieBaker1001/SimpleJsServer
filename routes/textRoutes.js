const express = require('express');
const server = express.Router();

const textService = require('../services/textService');

// GET /texts
// GET /texts?search=hello
server.get('/texts', (req, res) => {
    try {
        const searchTerm = req.query.search || '';

        if (typeof searchTerm !== 'string') {
            return res.status(400).json({
                error: 'Invalid search parameter.'
            });
        }

        const texts = textService.getAllTexts(searchTerm);
        res.json(texts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not retrieve texts." });
    }
});

// GET endpoint for fetching a random piece of text
server.get('/text', (req, res) => {

});

// GET endpoint for fetching a specific piece of text
server.get('/text/:id', (req, res) => {

});

// POST endpoint
server.post('/texts', (req, res) => {
    try {
        const data = req.body.text;
        const newEntry = textService.addText(data);

        res.status(201).json(newEntry);
    } catch (error) {
        console.error(error);
        res.status(error.status || 400).json({ error: error.message });
    }
});

// PUT endpoint
server.put('/texts/:id', (req, res) => {
    try {
        const updatedEntry = textService.updateText(
            req.params.id,
            req.body.text
        );

        if (!updatedEntry) {
            return rees.status(404).json({
                error: 'Text entry not found.'
            });
        }

        res.json(updatedEntry);
    } catch (error) {
        console.error(error);
        res.status(error.status || 400).json({ error: error.message });
    }
});

// DELETE endpoint
server.delete('/texts/:id', (req, res) => {
    try {
        const deletedEntry = textService.deleteText(req.params.id);
        
        if (!deletedEntry) {
            return res.status(404).json({
                error: 'Text entry not found.'
            });
        }

        res.json({ message: 'Text deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message });
    }
});

module.exports = server;