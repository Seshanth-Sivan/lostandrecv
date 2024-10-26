document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/found-items');
    const foundItems = await response.json();

    const itemsContainer = document.getElementById('items-container');
    itemsContainer.innerHTML = ''; // Clear the container before adding items

    foundItems.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.classList.add('item-card');

        itemCard.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p>Date Found: ${new Date(item.date).toLocaleDateString()}</p>
            <p>Location Found: ${item.location}</p>
            <img src="uploads/${item.image}" alt="${item.name}">
        `;

        itemsContainer.appendChild(itemCard);
    });
});
