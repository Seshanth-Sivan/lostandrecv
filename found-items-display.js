document.addEventListener('DOMContentLoaded', async () => {
    const itemsContainer = document.getElementById('items-container');

    // Fetch found items from the server
    const response = await fetch('/found-items');
    const foundItems = await response.json();

    // Populate the container with found items
    foundItems.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.classList.add('item-card');

        itemCard.innerHTML = `
            <img src="uploads/${item.image}" alt="${item.name}">
            <div>
                <h3>${item.name}</h3>
                <p><strong>Location Found:</strong> ${item.foundLocation}</p>
                <p><strong>Contact:</strong> ${item.contact}</p>
                <p><strong>Description:</strong> ${item.description}</p>
            </div>
        `;

        itemsContainer.appendChild(itemCard);
    });
});
