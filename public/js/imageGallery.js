window.imageGallery = (() => {
    async function loadImages() {
        const gallery = document.getElementById('imageGallery');
        try {
            const response = await fetch('/images');

            if (!response.ok) {
                throw new Error('Could not load images.');
            }

            // This is JSON containing filenames.
            const images = await response.json();

            gallery.replaceChildren();

            if (images.length === 0) {
                gallery.textContent = 'No images uploaded yet.';
                return;
            }

            for (const filename of images) {
                createImageCard(filename, gallery);
            }

        } catch (error) {
            console.error(error);
            gallery.textContent = 'Could not load images.';
        }
    }

    // Create a card representing one image entry.
    function createImageCard(filename, gallery) {
        const card = document.createElement('article');
        card.className = 'image-card';

        const image = document.createElement('img');

        image.src = `/images/${encodeURIComponent(filename)}`;
        image.alt = 'Uploaded image';
        image.loading = 'lazy';

        image.addEventListener('error', () => {
            console.error(`Failed to display image: ${filename}`);
        });

        const content = document.createElement('p');
        content.textContent = filename;

        const buttons = document.createElement('div');
        buttons.className = 'image-card-buttons';

        const renameButton = document.createElement('button');
        renameButton.textContent = 'Rename';
        renameButton.addEventListener('click', () => {
            renameImage(filename);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            deleteImage(filename);
        });

        buttons.append(renameButton, deleteButton);
        card.append(image, content, buttons);
        gallery.appendChild(card);
    }

    async function renameImage(filename) {
        const newText = prompt('New name of image:', filename);

        if (newText === null || newText.trim() === '') {
            return;
        }

        try {
            const response = await fetch(`/images/${encodeURIComponent(filename)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newText })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Could not update image.');
            }

            await loadImages();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    async function deleteImage(filename) {
        if (!confirm('Are you sure you want to delete this image?')) {
            return;
        }

        try {
            const response = await fetch(`/images/${filename}`, {
                method: 'DELETE'
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Could not delete text.");
            }

            await loadImages();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    async function uploadImage(file) {
        const response = await fetch('/images', {
            method: 'POST',
            headers: {
                'Content-Type': 'image/png'
            },
            body: file
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Upload failed.');
        }

        await loadImages();

        return result;
    }

    function initializeUpload() {
        const form = document.getElementById('imageForm');
        const fileInput = document.getElementById('imageFile');

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const file = fileInput.files[0];

            if (!file) return;

            if (file.type !== 'image/png') {
                alert('Please select a PNG image.');
                return;
            }

            try {
                await uploadImage(file);
                fileInput.value = '';
                alert('Image uploaded successfully!');
            } catch (error) {
                alert(error.message);
            }
        });
    }

    return {
        loadImages,
        initializeUpload
    };
})();