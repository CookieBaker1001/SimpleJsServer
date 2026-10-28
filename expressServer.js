const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const uploadDir = path.join(__dirname, 'uploads');
const textFile = path.join(uploadDir, 'texts.txt');

const server = express();

server.use(express.static(path.join(__dirname, 'public')));

// GET endpoint for /text url
server.get('/text', (req, res) => {
    if (!fs.existsSync(textFile)) {
        return res.status(404).send("No text entries stored yet");
    }

    const entries = fs.readFileSync(textFile, 'utf8').split('\n').filter(entry => entry.length > 0);
    if (entries.length === 0) {
        return res.status(404).send("No text entries stored yet");
    }

    const randomEntry = entries[Math.floor(Math.random() * entries.length)];
    res.type('text').send(randomEntry);
});

// GET endpoint for /text/:id url for fetching a specific piece of text
server.get('/text/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).send('Invalid text ID');
    }

    if (!fs.existsSync(textFile)) {
        return res.status(404).send('No text entries stored yet');
    }

    const entries = fs.readFileSync(textFile, 'utf8').split('\n').filter(entry => entry.length > 0);
    if (id > entries.length) {
        return res.status(404).send('Text entry not found');
    }

    res.type('text').send(entries[id - 1]);
});

// GET endpoint for /image url
server.get('/image', (req, res) => {
    if (!fs.existsSync(uploadDir)) {
        return res.status(404).send("No images uploaded yet");
    }

    const images = fs.readdirSync(uploadDir).filter(f => f.endsWith('png'));
    if (images.length === 0) {
        return res.status(404).send("No images uploadded yet!");
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];

    res.type('png').sendFile(path.join(uploadDir, randomImage));
});

// GET endpoint for /image/:filename for fetching a specific image
server.get('/image/:filename', (req, res) => {
    const filename = req.params.filename;

    // Only allow PNG filenames
    if (!/^[\w-]+\.png$/.test(filename)) {
        return res.status(400).send('Invalid image filename');
    }

    const imagePath = path.join(uploadDir, filename);

    if (!fs.existsSync(imagePath)) {
        return res.status(404).send('Image not found');
    }

    res.type('png').sendFile(imagePath);
});


// POST endpoint for /text url
server.post('/text', express.text({ type: 'text/plain', limit: '100kb' }), (req, res) => {
    if (typeof req.body !== "string" || req.body.length === 0) {
        return res.status(400).send("No text received!");
    }

    fs.mkdirSync(uploadDir, { recursive: true });

    const entry = req.body.replace(/[\r\n]+/g, ' ');

    fs.appendFileSync(textFile, entry + '\n', 'utf8');

    console.log("Text received", entry);
    res.status(201).send("Text received successfully!");
});

// POST endpoint for /image url
server.post('/image', express.raw({ type: ['image/png', 'application/octet-stream'], limit: '5mb' }), (req, res) => {
    if (!req.body || req.body.length === 0) {
        return res.status(400).send("No image received");
    }
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { received: true });
    }
    const fileName = `image-${Date.now()}-${Math.random().toString(16).slice(2)}.png`;

    fs.writeFileSync(path.join(uploadDir, fileName), req.body);

    console.log(`Image received ${fileName}`);
    res.send("Image received successfully!");
});

server.get('', (req, res) => {
    console.log('Response type:', res.constructor.name);
    console.log('res.status:', typeof res.status);

    res.status(200).send("Hello world!");
});

// Any endpoints that aren't defined
server.use((req, res) => {
    res.status(404).send("Endpoint not found!");
});

// Start listening
server.listen(PORT, () => {
    console.log("Sevrer is listening on port", PORT);
});