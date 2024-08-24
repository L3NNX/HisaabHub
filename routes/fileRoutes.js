// routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Hisaab = require('../models/hisaabModel');
const isAuthenticated = require('../middleware/authMiddleware');

// Get all files
router.get('/', (req, res) => {
    res.render('index',);
});

router.get('/hisaabs', isAuthenticated, async (req, res) => {
    try {
        const hisaabs = await Hisaab.find({ userId: req.session.userId });
        const userId = req.session.userId;
        const user = await User.findById(userId);
        const success_msg = req.session.success_msg;
        res.render('hisaabs', { hisaabs, user, success_msg });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Render create page
router.get('/create', isAuthenticated, (req, res) => {
    res.render('create');
});

// Handle Hisaab creation
router.post('/createhisaab', isAuthenticated, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newHisaab = new Hisaab({
            title,
            content,
            userId: req.session.userId
        });
        await newHisaab.save();
        res.redirect("/hisaabs");
    } catch (err) {
        res.status(500).send(err);
    }
});

// Edit a Hisaab
router.get('/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const hisaab = await Hisaab.findById(req.params.id);
        if (!hisaab) return res.status(404).send('Hisaab not found');
        res.render('edit', { hisaab });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update a Hisaab
router.post("/update/:id", isAuthenticated, async (req, res) => {
    try {
        const { title, content } = req.body;
        await Hisaab.findByIdAndUpdate(req.params.id, { title, content });
        res.redirect("/hisaabs");
    } catch (err) {
        res.status(500).send(err);
    }
});

// Delete a Hisaab
router.get('/delete/:id', isAuthenticated, async (req, res) => {
    try {
        await Hisaab.findByIdAndDelete(req.params.id);
        res.redirect('/hisaabs');
    } catch (err) {
        res.status(500).send(err);
    }
});

// Show a Hisaab
router.get('/show/:id', isAuthenticated, async (req, res) => {
    try {
        const hisaab = await Hisaab.findById(req.params.id);
        if (!hisaab) return res.status(404).send('Hisaab not found');
        res.render('display', { hisaab });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Render login page
router.get('/login', (req, res) => {
    res.render('login',{
        success_msg: req.flash('success_msg'),
        err_msg: req.flash('err_msg')
    });
});

//Login a user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            req.flash('err_msg', 'Invalid username or password');
            return res.redirect('/login');
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('err_msg', 'Invalid username or password');
            return res.redirect('/login');
        }

        // Store user information in session
        // req.session.user = user.username; 

        req.session.userId = user._id;

        //log results
        // console.log('Login:', { username, password });
        // console.log(req.flash('success_msg'))
        req.flash('success_msg', 'Login successful! Welcome back.');
        req.session.success_msg = req.flash('success_msg')
        return res.redirect('/hisaabs');
    } catch (err) {
        req.flash('err_msg', 'Server error');
        res.status(500).send('Server error');
    }
});

router.get('/signup', (req, res) => {
    res.render('signup',{
        success_msg: req.flash('success_msg'),
        err_msg: req.flash('err_msg')
    });
});

router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            // return res.status(400).send('Username already exists');
            req.flash('err_msg', 'Username already exists');
            return res.redirect('/signup');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        //log results
        console.log('Signup:', { username, password });
        req.flash('success_msg', 'Signup Successful!');
        return res.redirect('/login');
    } catch (err) {
        req.flash('err_msg', 'Something went wrong');
        return res.status(500);
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.redirect('/'); // Redirect to login page after logout
    });
});

module.exports = router;
