const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

dotenv.config({ path: '../.env' }); // Adjust path if running from seeds/

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hod_management');
        console.log('MongoDB Connected');

        // Create HOD
        const hodExists = await User.findOne({ email: 'hod@college.edu' });
        if (!hodExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            const hod = new User({
                name: 'Dr. Head of Dept',
                email: 'hod@college.edu',
                password: hashedPassword,
                role: 'hod',
                department: 'CSE',
                designation: 'Professor',
                isDoctorate: true
            });
            await hod.save();
            console.log('HOD Created: hod@college.edu');
        }

        // Create Faculty
        const facultyExists = await User.findOne({ email: 'faculty@college.edu' });
        if (!facultyExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('faculty123', salt);
            const faculty = new User({
                name: 'Prof. John Doe',
                email: 'faculty@college.edu',
                password: hashedPassword,
                role: 'faculty',
                department: 'CSE',
                designation: 'Assistant Professor'
            });
            await faculty.save();
            console.log('Faculty Created: faculty@college.edu');
        }

        // Create Student
        const studentExists = await User.findOne({ email: 'student@college.edu' });
        if (!studentExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('student123', salt);
            const student = new User({
                name: 'Jane Student',
                email: 'student@college.edu',
                password: hashedPassword,
                role: 'student',
                department: 'CSE',
                rollNumber: 'CSE2024001',
                batch: '2024-2028'
            });
            await student.save();
            console.log('Student Created: student@college.edu');
        }

        console.log('Seeding Complete');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
