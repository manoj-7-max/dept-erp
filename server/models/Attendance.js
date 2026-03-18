const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    subjectCode: {
        type: String,
        required: true
    },
    subjectName: {
        type: String,
        required: true
    },
    totalClasses: {
        type: Number,
        required: true
    },
    classesAttended: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
