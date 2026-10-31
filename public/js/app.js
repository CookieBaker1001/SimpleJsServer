const { loadImages } = window.imageGallery;
const { loadTexts } = window.textBoard;

document.addEventListener('DOMContentLoaded', async () => {

    window.imageGallery.initializeUpload();
    window.textBoard.initialize();

    await Promise.all([
        loadImages(),
        loadTexts()
    ]);
});