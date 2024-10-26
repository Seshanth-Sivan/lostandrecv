document.addEventListener('DOMContentLoaded', () => {
    const lostForm = document.getElementById('lost-form');

    if (lostForm) {
        lostForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(lostForm);

            const response = await fetch('/api/lost-item', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            alert(result.message);
            lostForm.reset();
        });
    }
});
