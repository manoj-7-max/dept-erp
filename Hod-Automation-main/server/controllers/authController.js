const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, department, rollNumber, batch, designation, isDoctorate } = req.body;

        // Simple check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            department,
            rollNumber,
            batch,
            designation,
            isDoctorate
        });

        await user.save();

        const payload = { user: { id: user.id, role: user.role, department: user.department } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, role: user.role, department: user.department } });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for: ${email}`);

        if (!email || !password) {
            return res.status(400).json({ msg: 'Email and password are required' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // 1. Check for Hardcoded/Mock users first for demo purposes
        let user = null;
        if (normalizedEmail === 'hod@college.edu' && password === 'admin123') {
            user = { id: 'mock-hod-id', role: 'hod', department: 'CSE', name: 'Dr. Head of Dept' };
        } else if (normalizedEmail === 'faculty@college.edu' && password === 'faculty123') {
            user = { id: 'mock-faculty-id', role: 'faculty', department: 'CSE', name: 'Prof. John Doe' };
        } else if (normalizedEmail === 'student@college.edu' && password === 'student123') {
            user = { id: 'mock-student-id', role: 'student', department: 'CSE', name: 'Jane Student' };
        }

        // 2. If not a mock user, check the database
        if (!user) {
            user = await User.findOne({ email: normalizedEmail });
            if (user) {
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    console.warn(`Invalid password for: ${normalizedEmail}`);
                    return res.status(400).json({ msg: 'Invalid Credentials' });
                }
                // Convert mongoose object to plain object
                user = {
                    id: user._id,
                    name: user.name,
                    role: user.role,
                    department: user.department
                };
            }
        }

        if (!user) {
            console.warn(`User not found: ${normalizedEmail}`);
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 3. Generate JWT
        const payload = { user: { id: user.id, role: user.role, department: user.department } };
        
        // Use synchronous sign or wrap in try-catch properly
        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET || 'your_jwt_secret_key_here', 
            { expiresIn: '5h' }
        );

        console.log(`User ${user.name} logged in successfully as ${user.role}`);
        res.json({ token, user });

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};
