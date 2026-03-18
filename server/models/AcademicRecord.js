const mongoose = require('mongoose');

const AcademicRecordSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    semester: { type: Number, required: true },
    assessmentType: {
        type: String,
        enum: ['Internal Assessment 1', 'Internal Assessment 2', 'Class Test', 'Assignment 1', 'Assignment 2', 'Semester Marks', 'Seminar Marks', 'Quiz Marks'],
        required: true
    },
    subjects: [{
        subjectCode: { type: String, required: true },
        subjectName: { type: String, required: true },
        marksScored: { type: Number, required: true },
        maximumMarks: { type: Number, required: true },
        grade: { type: String, required: false }
    }]
});

// Ensure a student only has one record per assessment per semester
AcademicRecordSchema.index({ studentId: 1, semester: 1, assessmentType: 1 }, { unique: true });

module.exports = mongoose.model('AcademicRecord', AcademicRecordSchema);
