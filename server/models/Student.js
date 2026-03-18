const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    registerNumber: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    year: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    homeAddress: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    bloodGroup: { type: String, required: true },
    admissionType: { type: String, required: true },
    category: { type: String, required: true },
    password: { type: String, required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' },
});

module.exports = mongoose.model('Student', StudentSchema);
