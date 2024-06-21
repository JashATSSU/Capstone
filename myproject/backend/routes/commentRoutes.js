const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// POST a new comment
router.post('/', async (req, res) => {
    try {
        const newComment = new Comment(req.body);
        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET all comments for a specific user (example)
router.get('/user/:userId', async (req, res) => {
    try {
        const comments = await Comment.find({ user: req.params.userId });
        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
