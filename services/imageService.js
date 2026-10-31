const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const uploadDir = path.join(__dirname, '..', 'uploads');

// Create the uploads directory if it doesn't exist.
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Return an array of image filenames
function getAllImages() {
    return fs.readdirSync(uploadDir)
        .filter(filename => /^[\w-]+\.png$/i.test(filename));
}

function getRandomImagePath(filename) {
    if (!/^[\w-]+\.png$/i.test(filename)) {
        return null;
    }

    return null;
}

// Get the full path to an image.
function getImagePath(filename) {
    if (!/^[\w-]+\.png$/i.test(filename)) {
        return null;
    }

    const imagePath = path.join(uploadDir, filename);

    return fs.existsSync(imagePath) ? imagePath : null;
}

function saveImage(buffer) {
    if (!Buffer.isBuffer(buffer)) {
        throw new Error('Invalid image data.');
    }

    // Check the PNG file signature.
    const pngSignature = Buffer.from([
        0x89, 0x50, 0x4E, 0x47,
        0x0D, 0x0A, 0x1A, 0x0A
    ]);

    if (buffer.length < 8 ||
        !buffer.subarray(0, 8).equals(pngSignature)) {
        throw new Error('Uploaded file is not a valid PNG.');
    }

    const filename = `${crypto.randomUUID()}.png`;
    const imagePath = path.join(uploadDir, filename);

    fs.writeFileSync(imagePath, buffer);

    return filename;
}

function deleteImage(filename) {
    const imagePath = getImagePath(filename);

    if (!imagePath) {
        return false;
    }

    fs.unlinkSync(imagePath);
    return true;
}

module.exports = {
    getAllImages,
    getImagePath,
    saveImage,
    deleteImage
};