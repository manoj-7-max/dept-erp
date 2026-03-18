const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

require('dotenv').config();

const users = [
    {
        name: 'HOD CSE',
        email: 'hod.cse@college.edu',
        password: 'hod123',
        role: 'hod',
        department: 'CSE'
    },
    {
        name: 'K. Vanishree',
        email: 'vanishree@college.edu',
        password: 'password123',
        role: 'class_incharge',
        department: 'CSE',
        section: 'CSE_2_A'
    },
    {
        name: 'Chitralekha',
        email: 'chitralekha@college.edu',
        password: 'password123',
        role: 'class_incharge',
        department: 'CSE',
        section: 'CSE_2_B'
    },
    {
        name: 'G. Vinitha',
        email: 'vinitha@college.edu',
        password: 'password123',
        role: 'class_incharge',
        department: 'CSE',
        section: 'CSE_3_A'
    },
    {
        name: 'Alagu Manohar',
        email: 'alagu@college.edu',
        password: 'password123',
        role: 'class_incharge',
        department: 'CSE',
        section: 'CSE_3_B'
    },
    {
        name: 'Faculty One',
        email: 'faculty1@college.edu',
        password: 'faculty123',
        role: 'faculty',
        department: 'CSE',
        section: 'CSE_3_A'
    }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/university_erp')
    .then(async () => {
        console.log('✅ Connected to MongoDB');
        
        for (const userData of users) {
            const existingUser = await User.findOne({ email: userData.email });
            if (!existingUser) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(userData.password, salt);
                
                await User.create({
                    ...userData,
                    password: hashedPassword
                });
                console.log(`User seeded: ${userData.email}`);
            } else {
                console.log(`User already exists: ${userData.email}`);
            }
        }
        
        console.log('✅ Data seeding completed');
        mongoose.disconnect();
    })
    .catch(err => {
        console.error('❌ Connection error:', err);
        process.exit(1);
    });
