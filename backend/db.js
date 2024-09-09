const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (prints a message to the console)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Bind connection to open event (prints a success message to the console)
db.once('open', () => {
    console.log('Connected to MongoDB Atlas');
});

module.exports = db;
