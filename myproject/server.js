const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const cors = require('cors');
const db = require('./db'); // Assuming db.js is in the same directory
const userRoutes = require('./routes/userRoutes');
const commentRoutes = require('./routes/commentRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const mongooseConnection = mongoose.connection;
mongooseConnection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongooseConnection.once('open', () => {
    console.log('Connected to MongoDB');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);

// Route to fetch resort data from RapidAPI
app.get('/api/resort/:mountainName', async (req, res) => {
    const { mountainName } = req.params;

    try {
        const response = await axios.get('https://ski-resorts-and-conditions.p.rapidapi.com/v1/resort', {
            params: {
                name: mountainName
            },
            headers: {
                'x-rapidapi-key': RAPIDAPI_KEY,
                'x-rapidapi-host': 'ski-resorts-and-conditions.p.rapidapi.com'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
