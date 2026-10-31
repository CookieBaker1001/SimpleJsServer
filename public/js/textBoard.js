window.textBoard = (() => {
    async function loadTexts(searchTerm = '') {
        const board = document.getElementById('textBoard');

        try {

            const url = searchTerm
                ? `/texts?search=${encodeURIComponent(searchTerm)}`
                : '/texts';

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Could not retrieve texts.');
            }

            const texts = await response.json();

            board.replaceChildren();

            if (texts.length === 0) {
                board.textContent = 'No text entries yet.';
                return;
            }

            for (const entry of texts) {

                createTextCard(entry, board);

                
            }
        } catch (error) {
            console.error(error);
            board.textContent = 'Could not load texts.';
        }
    }

    // Create a card representing one text entry.
    function createTextCard(entry, board) {
        const card = document.createElement('article');
        card.className = 'text-card';

        const content = document.createElement('p');
        content.textContent = entry.text;

        const date = document.createElement('small');
        date.textContent = new Date(entry.createdAt).toLocaleString();

        const buttons = document.createElement('div');
        buttons.className = 'text-card-buttons';

        // Edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';

        editButton.addEventListener('click', () => {
            editText(entry);
        });

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';

        deleteButton.addEventListener('click', () => {
            deleteText(entry.id);
        });

        buttons.append(editButton, deleteButton);

        card.append(content, date, buttons);
        board.appendChild(card);
    }

    async function uploadText(text) {
        const response = await fetch('/texts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            //body: text
            body: JSON.stringify({
                text: text
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Upload failed.');
        }

        await loadTexts();

        return result;
    }

    async function editText(entry) {
        const newText = prompt('Edit your text:', entry.text);

        if (newText === null || newText.trim() === '') {
            return;
        }

        try {
            const response = await fetch(`/texts/${entry.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newText })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Could not update text.');
            }

            await loadTexts(document.getElementById('textSearch').value);
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    async function deleteText(id) {
        if (!confirm('Are you sure you want to delete this entry?')) {
            return;
        }

        try {
            const response = await fetch(`/texts/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();

            if (!response.ok) {
                /* This one -> */throw new Error(result.error || "Could not delete text.");
            }

            await loadTexts(document.getElementById("textSearch").value);
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    // Initialize the form and search input.
    function initialize() {
        const form = document.getElementById('textForm');
        const textInput = document.getElementById('textInput');
        const searchInput = document.getElementById('textSearch');

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const text = textInput.value.trim();

            if (!text) return;

            try {
                await uploadText(text);
                textInput.value = '';

                // Reload the board, preserving the current search.
                await loadTexts(searchInput.value);
            } catch (error) {
                console.error(error);
                alert(error.message);
            }
        });

        // Search whenever the search input changes.
        searchInput.addEventListener('input', () => {
            loadTexts(searchInput.value);
        });
    }

    return {
        initialize,
        loadTexts
    };
})();