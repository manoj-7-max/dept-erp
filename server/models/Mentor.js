const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    designation: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true },
    department: { type: String, required: true }
});

module.exports = mongoose.model('Mentor', MentorSchema);
