const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
    try {
        console.log('Attempting to connect to Local MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hod_management', {
            serverSelectionTimeoutMS: 2000
        });
        console.log('MongoDB Connected successfully (Local)');
    } catch (error) {
        console.error('Local MongoDB Connection failed. Booting up In-Memory Mock Database (Fast)...');
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();

            await mongoose.connect(mongoUri);
            console.log('In-Memory MongoDB Connected! Mocking user data...');

            const User = require('../models/User');

            const salt = await bcrypt.genSalt(10);

            await new User({
                name: 'Dr. Head of Dept',
                email: 'hod@college.edu',
                password: await bcrypt.hash('admin123', salt),
                role: 'hod',
                department: 'CSE',
                designation: 'Professor',
                isDoctorate: true
            }).save();

            const facultyData = [
                { name: 'Prof. John Doe', email: 'faculty@college.edu', role: 'faculty', department: 'CSE', designation: 'Assistant Professor', isDoctorate: false },
                { name: 'Ms. G. Vinitha', email: 'g.vinitha@kvcet.edu', role: 'faculty', department: 'CSE', designation: 'Assistant Professor', isDoctorate: false },
                { name: 'Ms. K. Vani Shree', email: 'k.vanishree@kvcet.edu', role: 'faculty', department: 'CSE', designation: 'Assistant Professor', isDoctorate: false },
                { name: 'Ms. S. Gayathri', email: 's.gayathri@kvcet.edu', role: 'faculty', department: 'CSE', designation: 'Assistant Professor', isDoctorate: false },
                { name: 'Dr. V. S. Thiyagarajan', email: 'v.s.thiyagarajan@kvcet.edu', role: 'faculty', department: 'CSE', designation: 'Professor', isDoctorate: true },
                { name: 'Ms. M. Muthuselvi', email: 'm.muthuselvi@kvcet.edu', role: 'faculty', department: 'CSE', designation: 'Assistant Professor', isDoctorate: false },
                { name: 'Ms. Usha Devi', email: 'ushadevi@kvcet.edu', role: 'faculty', department: 'CSE', designation: 'Assistant Professor', isDoctorate: false },
                { name: 'Ms. Bhuviya', email: 'bhuviya@kvcet.edu', role: 'faculty', department: 'CSE', designation: 'Trainer', isDoctorate: false },
            ];

            for (let fac of facultyData) {
                fac.password = await bcrypt.hash('faculty123', salt);
                await new User(fac).save();
            }

            await new User({
                name: 'Jane Student',
                email: 'student@college.edu',
                password: await bcrypt.hash('student123', salt),
                role: 'student',
                department: 'CSE',
                rollNumber: 'CSE2024001',
                batch: '2024-2028'
            }).save();

            console.log('Mock DB Ready! The site will now respond instantly with demo data.');
        } catch (memErr) {
            console.error('Failed to start In-Memory MongoDB:', memErr.message);
        }
    }
};

module.exports = connectDB;
