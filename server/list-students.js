require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');
const connectDB = require('./config/db');

async function listStudents() {
    try {
        await connectDB();
        const students = await Student.find({}, 'name registerNumber email');
        console.log('Students in database:');
        console.log(JSON.stringify(students, null, 2));
        process.exit();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

listStudents();
