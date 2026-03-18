const mongoose = require('mongoose');

const mentoringFeedbackSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    meetingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MentoringMeeting',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    feedbackComments: {
        type: String,
        required: true
    },
    suggestions: {
        type: String
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MentoringFeedback', mentoringFeedbackSchema);
