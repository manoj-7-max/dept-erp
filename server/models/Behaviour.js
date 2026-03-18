const mongoose = require('mongoose');

const BehaviourSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    attendanceRemarks: { type: String, required: true },
    disciplineRemarks: { type: String, required: true },
    facultyComments: { type: String, required: true }
});

module.exports = mongoose.model('Behaviour', BehaviourSchema);
