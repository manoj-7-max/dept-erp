const User = require('../models/User');
const Student = require('../models/Student');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Identifier and password are required' });
        }

        const identifier = email.trim();

        // Check if the user collection is empty, which is a critical setup error.
        const allUsers = await User.find({});
        if (allUsers.length === 0) {
            console.error("[CRITICAL] User Database is completely empty! Seed script was not run.");
        }

        // Case-insensitive search for the user identifier
        const escapedIdentifier = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchRegex = new RegExp(`^${escapedIdentifier}$`, 'i');

        const user = await User.findOne({
            $or: [
                { email: searchRegex },
                { registerNumber: searchRegex },
                { rollNumber: searchRegex },
                { regNo: searchRegex },
                { rollNo: searchRegex }
            ]
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });

        // Return normalized user object for AuthContext
        res.status(200).json({ token, user: { id: user._id, name: user.name, role: user.role, department: user.department } });
    } catch (error) {
        console.error('[Auth Debug] Login Error:', error);
        res.status(500).json({ error: error.message });
    }
};