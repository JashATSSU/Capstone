const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// POST a new comment
router.post('/', async (req, res) => {
    try {
        const { user, text } = req.body;
        if (!user || !text) {
            return res.status(400).json({ message: 'User and text are required' });
        }

        const newComment = new Comment(req.body);
        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET all comments for a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const comments = await Comment.find({ user: req.params.userId });
        if (comments.length === 0) {
            return res.status(404).json({ message: 'No comments found for this user' });
        }
        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
