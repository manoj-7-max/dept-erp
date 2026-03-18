const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    regNo: { type: String }, // ref to Student's regNo
    date: { type: Date },
    subjectCode: { type: String },
    subjectName: { type: String },
    subject: { type: String },
    status: { type: String }, // Present / Absent
    faculty: { type: String },
    section: { type: String },
    totalClasses: { type: Number },
    classesAttended: { type: Number }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
