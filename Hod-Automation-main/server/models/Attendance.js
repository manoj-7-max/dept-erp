const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent'], required: true },
    subject: { type: String, required: true },
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Who marked it
});

module.exports = mongoose.model('Attendance', attendanceSchema);
