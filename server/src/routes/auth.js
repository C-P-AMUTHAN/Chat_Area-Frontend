// src/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Register route
router.post('/register', async (req, res) => {
    console.log('Register attempt:', req.body);

    try {
        const { name, email, password, phone_number, company_name } = req.body;

        // Validation
        if (!name || !email || !password || !phone_number || !company_name) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password,
            tenant_id: uuidv4(),
            phone_number,
            company_name,
            role: 'admin', // First user is admin
        });

        await user.save();

        console.log('Registration successful');
        return res.status(201).json({
            message: 'Registration successful. Please log in.',
        });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            message: 'Server error',
            error: error.message,
        });
    }
});

// Login route
router.post('/login', async (req, res) => {
    console.log('Login attempt:', req.body);

    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        console.log('User found:', user ? 'yes' : 'no');

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        console.log('Password match:', isMatch ? 'yes' : 'no');

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            {
                id: user._id,
                tenant_id: user.tenant_id,
                email: user.email,
                name: user.name,
                role: user.role,
                phone_number: user.phone_number,
                company_name: user.company_name,
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Login successful');
        return res.json({ access_token: token });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});


module.exports = router;