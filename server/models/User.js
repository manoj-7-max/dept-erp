const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Will be hashed via bcrypt
    role: {
        type: String,
        required: true,
        enum: ['student', 'faculty', 'class_incharge', 'hod', 'admin']
    },
    department: { type: String, required: true },

    // Conditional specific fields
    registerNumber: { type: String, unique: true, sparse: true }, // For Students
    employeeId: { type: String, unique: true, sparse: true },     // For Faculty/HOD

    // Self-referencing link (e.g., Student pointing to Faculty)
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);