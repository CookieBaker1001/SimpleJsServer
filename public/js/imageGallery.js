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
                const card = document.createElement('div');
                card.className = 'image-card';

                const image = document.createElement('img');

                image.src = `/image/${encodeURIComponent(filename)}`;
                image.alt = 'Uploaded image';
                image.loading = 'lazy';

                image.addEventListener('error', () => {
                    console.error(`Failed to display image: ${filename}`);
                });

                card.appendChild(image);
                gallery.appendChild(card);
            }

        } catch (error) {
            console.error(error);
            gallery.textContent = 'Could not load images.';
        }
    }

    async function uploadImage(file) {
        const response = await fetch('/image', {
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