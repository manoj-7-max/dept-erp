const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    registerNumber: { type: String, unique: true, sparse: true },
    regNo: { type: String, unique: true, sparse: true },
    department: { type: String },
    dept: { type: String },
    year: { type: Number },
    section: { type: String },
    email: { type: String, unique: true, sparse: true },
    phoneNumber: { type: String },
    homeAddress: { type: String },
    dateOfBirth: { type: Date },
    bloodGroup: { type: String },
    admissionType: { type: String },
    category: { type: String },
    password: { type: String },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' },
});

module.exports = mongoose.model('Student', StudentSchema);
