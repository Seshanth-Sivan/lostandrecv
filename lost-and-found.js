// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const lostForm = document.getElementById('lost-form');
    const foundForm = document.getElementById('found-form');

    // Handle Lost Item Form Submission
    if (lostForm) {
        lostForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            const formData = new FormData(lostForm); // Collect form data

            // Send the form data to the server
            const response = await fetch('/api/lost-item', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            alert(result.message); // Show success message
            lostForm.reset(); // Reset the form
        });
    }

    // Handle Found Item Form Submission
    if (foundForm) {
        foundForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            const formData = new FormData(foundForm); // Collect form data

            // Send the form data to the server
            const response = await fetch('/api/found-item', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            alert(result.message); // Show success message
            foundForm.reset(); // Reset the form
        });
    }
});
