document.addEventListener('DOMContentLoaded', async () => {
    const itemsContainer = document.getElementById('items-container');
    const response = await fetch('/api/lost-items');
    const lostItems = await response.json();

    lostItems.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p>Date Lost: ${new Date(item.date).toLocaleDateString()}</p>
            <p>Location Lost: ${item.location}</p>
            <img src="uploads/${item.image}" alt="${item.name}">
            <button onclick="markAsFound('${item._id}', '${item.name}', '${item.description}', '${item.date}', '${item.location}', '${item.image}')">Mark as Found</button>
        `;
        itemsContainer.appendChild(itemCard);
    });
});

async function markAsFound(id, name, description, date, location, image) {
    const response = await fetch(`/api/found-item/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            description,
            date,
            location,
            image
        })
    });

    if (response.ok) {
        alert('Item marked as found successfully');
        location.reload(); // Refresh the page to see the updated list
    } else {
        alert('Error marking item as found');
    }
}
