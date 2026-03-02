const express = require('express');
const router = express.Router();
const path = require('path');
const Blog = require('../models/blog');
router.get('/add-blog', (req, res) => {
    res.render('addBlog.ejs', { user: req.user });
});
router.post('/add-blog', async (req, res) => {
    try {
        // Authentication removed: allow creating blogs without requiring a logged-in user.
        const { title, content, imageUrl } = req.body;
        if (!title || !content) {
            return res.status(400).send('Title and content are required');
        }
        let coverImageUrl = '/images/default.png';
        if (imageUrl && imageUrl.trim()) {
            coverImageUrl = imageUrl.trim();
        }
        await Blog.create({
            title,
            content,
            coverImageUrl,
            createdBy: req.user ? req.user._id : null
        });
        return res.redirect('/');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Error creating blog');
    }
});

// GET - Get single blog by ID (minimal view)
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('createdBy');
        if (!blog) return res.status(404).send('Blog not found');
        return res.render('blogDetail.ejs', { blog, user: req.user });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Error fetching blog');
    }
});

module.exports = router;
