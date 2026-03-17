const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'faculty', 'hod'], required: true },
    department: { type: String, required: true }, // e.g., 'CSE', 'IT'

    // Specific to Student
    rollNumber: { type: String },
    batch: { type: String },

    // Specific to Faculty
    designation: { type: String }, // e.g., AP, Prof
    isDoctorate: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
