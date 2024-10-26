const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the public folder

// Serve the index.html file for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/lostandfound')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Mongoose schema for Lost and Found Items
const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    image: { type: String },
    foundDetails: {
        foundBy: { type: String },
        contact: { type: String },
        foundLocation: { type: String },
    },
});

// Model for Lost Items
const LostItem = mongoose.model('LostItem', itemSchema);

// Model for Found Items
const FoundItem = mongoose.model('FoundItem', itemSchema);

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage: storage });

// Route to submit lost item
app.post('/api/lost-item', upload.single('image'), async (req, res) => {
    try {
        const { name, description, date, location } = req.body;
        const image = req.file ? req.file.filename : null;

        const lostItem = new LostItem({
            name,
            description,
            date,
            location,
            image,
        });

        await lostItem.save();
        res.json({ message: 'Lost item reported successfully' });
    } catch (error) {
        console.error('Error reporting lost item:', error);
        res.status(500).json({ message: 'Error reporting lost item' });
    }
});

// Route to get lost items
app.get('/api/lost-items', async (req, res) => {
    try {
        const lostItems = await LostItem.find();
        res.json(lostItems);
    } catch (error) {
        console.error('Error fetching lost items:', error);
        res.status(500).json({ message: 'Error fetching lost items' });
    }
});

// Route to mark item as done (move to found items)
app.post('/api/mark-done/:id', async (req, res) => {
    const { id } = req.params;
    const { foundBy, contact, foundLocation } = req.body;

    try {
        // Find the lost item
        const lostItem = await LostItem.findById(id);
        
        if (!lostItem) {
            return res.status(404).json({ message: 'Lost item not found' });
        }

        // Create a found item using lost item data
        const foundItem = new FoundItem({
            name: lostItem.name,
            description: lostItem.description,
            date: lostItem.date,
            location: lostItem.location,
            image: lostItem.image,
            foundDetails: {
                foundBy,
                contact,
                foundLocation,
            },
        });

        // Save found item to the database
        await foundItem.save();

        // Delete the lost item from the database
        await LostItem.findByIdAndDelete(id);
        
        res.json({ message: 'Item marked as done and moved to found items successfully' });
    } catch (error) {
        console.error('Error marking item as done:', error);
        res.status(500).json({ message: 'Error marking item as done' });
    }
});

// Route to get found items
app.get('/api/found-items', async (req, res) => {
    try {
        const foundItems = await FoundItem.find();
        res.json(foundItems);
    } catch (error) {
        console.error('Error fetching found items:', error);
        res.status(500).json({ message: 'Error fetching found items' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
