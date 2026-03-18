const User = require('../models/User');
const Student = require('../models/Student');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        console.log("\n--- DEEP DEBUG LOGIN START ---");

        // STEP 1: VERIFY REQUEST INPUT
        console.log("[Step 1] Incoming req.body:", req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Identifier and password are required' });
        }

        const identifier = email.trim();

        // STEP 2: VERIFY DATABASE CONNECTION
        console.log(`[Step 2] DB Connection State: ${mongoose.connection.readyState} (0: disconnected, 1: connected, 2: connecting)`);

        // STEP 3 & 6: FORCE CHECK DATABASE DATA
        // We pull from User because your auth logic relies on the Unified User collection
        const allUsers = await User.find({}, 'email registerNumber rollNumber regNo role name').lean();
        console.log("[Step 3] DB Users Dump (Unified Auth Collection):", allUsers);

        const allStudents = await Student.find({}, 'email registerNumber name').lean();
        console.log("[Step 3] DB Students Dump (Student Collection):", allStudents);

        if (allUsers.length === 0) {
            console.error("[CRITICAL] User Database is completely empty! Seed script was not run.");
        }

        // STEP 4 & 5: CASE + FORMAT FIX & FIELD NAME CONFIRMATION
        const escapedIdentifier = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchRegex = new RegExp(`^${escapedIdentifier}$`, 'i');

        console.log(`[Step 4] Searching for identifier: "${identifier}" using regex:`, searchRegex);

        let user = await User.findOne({
            $or: [
                { email: searchRegex },
                { registerNumber: searchRegex },
                { rollNumber: searchRegex },
                { regNo: searchRegex },
                { rollNo: searchRegex }
            ]
        });

        let isStudentFallback = false;

        if (!user) {
            // Check student model
            user = await Student.findOne({
                $or: [
                    { email: searchRegex },
                    { registerNumber: searchRegex },
                    { regNo: searchRegex }
                ]
            });

            if (!user) {
                console.warn(`[Step 4] User NOT FOUND in DB for identifier: ${identifier}`);
                console.log("--- DEEP DEBUG LOGIN END ---\n");
                return res.status(404).json({ error: 'User not found' });
            }
            isStudentFallback = true;
            user.role = 'student'; // Provide role
        }

        console.log(`[Step 4] User Found! ID: ${user._id}, Role: ${user.role}`);

        // STEP 7: PASSWORD CHECK DEBUG
        console.log(`[Step 7] Entered password: "${password}"`);
        console.log(`[Step 7] Stored password hash: "${user.password}"`);

        let isMatch = false;
        
        if (isStudentFallback && (!user.password || !user.password.startsWith('$2'))) {
            // Plain text check or unhashed password match from CSV? 
            if (user.password) {
                isMatch = await bcrypt.compare(password, user.password).catch(() => password === user.password);
            } else {
                // Default password for students if not set
                isMatch = password === 'student123' || password === user.dateOfBirth?.toISOString().split('T')[0];
            }
        } else {
            isMatch = await bcrypt.compare(password, user.password).catch(() => password === user.password);
        }
        console.log(`[Step 7] Password Match Result: ${isMatch}`);

        if (!isMatch) {
            console.warn(`[Auth Debug] Incorrect password for: ${identifier}`);
            console.log("--- DEEP DEBUG LOGIN END ---\n");
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });

        console.log(`[Auth Debug] User ${user.name} logged in successfully as ${user.role}`);
        console.log("--- DEEP DEBUG LOGIN END ---\n");

        // Return normalized user object for AuthContext
        res.status(200).json({ token, user: { id: user._id, name: user.name, role: user.role, department: user.department } });
    } catch (error) {
        console.error('[Auth Debug] Login Error:', error);
        res.status(500).json({ error: error.message });
    }
};