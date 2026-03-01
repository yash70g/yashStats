const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blog');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../images'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});
router.get('/add-blog', (req, res) => {
    if (!req.user) {
        return res.redirect('/user/signin');
    }
    res.render('addBlog.ejs', { user: req.user });
});
router.post('/add-blog', upload.single('coverImage'), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send('Unauthorized');
        }
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).send('Title and content are required');
        }
        let coverImageUrl = '/images/default.png';
        if (req.file) {
            coverImageUrl = `/images/${req.file.filename}`;
        }
        await Blog.create({
            title,
            content,
            coverImageUrl,
            createdBy: req.user._id
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
