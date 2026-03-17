const mongoose = require('mongoose');

const mentoringTaskSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentor',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Follow-up Required'],
        default: 'Pending'
    },
    dueDate: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('MentoringTask', mentoringTaskSchema);
