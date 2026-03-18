const mongoose = require('mongoose');

const internalMarkSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    marks: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    examType: { type: String, required: true }, // CIA1, CIA2, Model
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Who entered it
});

module.exports = mongoose.model('InternalMark', internalMarkSchema);
