const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const uploadDir = path.join(__dirname, '..', 'uploads');
const textFilePath = path.join(uploadDir, 'texts.json');

// Maximum length of a text entry.
const MAX_TEXT_LENGTH = 2000;

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Make sure the storage directory and JSON file exist.
function initializeStorage() {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
    }

    if (!fs.existsSync(textFilePath)) {
        fs.writeFileSync(textFilePath, '[]', 'uft8');
    }
}

// Private method
// Read all entries from the JSON file.
function getTexts() {
    initializeStorage();

    const data = fs.readFileSync(textFilePath, 'utf8');
    return JSON.parse(data);
}

// Write all entries to the JSON file.
function saveTexts(texts) {
    fs.writeFileSync(textFilePath, JSON.stringify(texts, null, 4), 'utf8');
}

// Retrieve all entries, optionally filtered by a search term.
function getAllTexts(searchTerm = '') {
    const texts = getTexts();

    if (!searchTerm.trim()) {
        return texts;
    }
    
    const search = searchTerm.trim().toLowerCase();

    return texts.filter(entry => entry.text.toLowerCase().includes(search));
}

// Add a new text entry.
function addText(text) {
    const validatedText = validateText(text);
    const texts = getTexts();

    const now = new Date().toISOString();

    const entry = {
        id: crypto.randomUUID(),
        text: validatedText,
        createdAt: now,
        updatedAt: now
    };

    texts.push(entry);
    saveTexts(texts);

    return entry;
}

// Update an existing text entry.
function updateText(id, text) {
    const validatedText = validateText(text);
    const texts = getTexts();

    const entry = texts.find(item => item.id === id);

    if (!entry) {
        return null;
        //throw createError('Text not found.', 404);
    }

    entry.text = validatedText;
    entry.updatedAt = new Date().toISOString();

    saveTexts(texts);

    return entry;
}

// Delete an existing text entry.
function deleteText(id) {
    const texts = getTexts();
    const index = texts.filter(item => item.id !== id);

    if (index === -1) {
        return false;
    }

    // if (remaining.length === texts.length) {
    //     throw createError('Text not found.', 404);
    // }

    texts.splice(index, 1);
    saveTexts(texts);

    return true;
}

// Validate text before saving it.
function validateText(text) {
    if (typeof text !== 'string' || !text.trim()) {
        throw createError('Text cannot be empty.', 400);
    }

    if (text.length > MAX_TEXT_LENGTH) {
        throw createError(`Text cannot exceed ${MAX_TEXT_LENGTH} characters.`, 400);
    }

    return text.trim();
}

function createError(message, status) {
    const error = new Error(message);
    error.status = status;
    return error;
}

module.exports = {
    getAllTexts,
    addText,
    updateText,
    deleteText
};