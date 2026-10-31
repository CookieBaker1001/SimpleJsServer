const express = require('express');
const path = require('path');

const imageRoutes = require('./routes/imageRoutes');
const textRoutes = require('./routes/textRoutes');

const PORT = 8080;
const server = express();

// Middleware
server.use(express.json());
server.use(express.static(path.join(__dirname, 'public')));

server.use('/', imageRoutes);
server.use('/', textRoutes);

// index url
server.get('', (req, res) => {
    console.log('Response type:', res.constructor.name);
    console.log('res.status:', typeof res.status);

    res.status(200).send("Hello world!");
});

// Any endpoints that aren't defined
server.use((req, res) => {
    res.status(404).send("Page not found!");
});

// Start listening
server.listen(PORT, () => {
    console.log("Sevrer is listening on port", PORT);
});



function readTexts() {
    if (!fs.existsSync(textsJsonFile)) {
        // Migrate existing entries from texts.txt on first run.
        const oldTextFile = path.join(uploadDir, 'texts.txt');

        let oldEntries = [];

        if (fs.existsSync(oldTextFile)) {
            oldEntries = fs.readFileSync(oldTextFile, 'utf8')
                .split(/\r?\n/)
                .filter(text => text.trim() !== '');
        }

        const texts = oldEntries.map(text => ({
            id: crypto.randomUUID(),
            text,
            createdAt: new Date().toISOString()
        }));

        writeTexts(texts);
        return texts;
    }

    return JSON.parse(fs.readFileSync(textsJsonFile, 'utf8'));
}

function writeTexts(texts) {
    fs.writeFileSync(
        textsJsonFile,
        JSON.stringify(texts, null, 2),
        'utf8'
    );
}