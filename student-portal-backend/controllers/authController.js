const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginStudent = async (req, res) => {
    try {
        const { registerNumber, password } = req.body;

        // Check for student - Add trim() to prevent whitespace issues
        const student = await Student.findOne({ registerNumber: registerNumber.trim() });

        if (!student) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Match password - Add trim() to prevent whitespace issues
        let inputPassword = password;
        if (typeof password === 'string') {
            inputPassword = password.trim();
        }
        const isMatch = await bcrypt.compare(inputPassword, student.password);

        if (isMatch) {
            res.json({
                _id: student._id,
                name: student.name,
                registerNumber: student.registerNumber,
                email: student.email,
                token: generateToken(student._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { loginStudent };
