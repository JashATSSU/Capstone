const express = require('express');
const db = require('./db'); // Assuming db.js is in the same directory
const userRoutes = require('./routes/userRoutes');
const commentRoutes = require('./routes/commentRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
