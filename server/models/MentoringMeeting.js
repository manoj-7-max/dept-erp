const mongoose = require('mongoose');

const mentoringMeetingSchema = new mongoose.Schema({
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
    meetingType: {
        type: String,
        enum: ['Mentor Meeting', 'Class Committee Meeting'],
        default: 'Mentor Meeting',
        required: true
    },
    meetingDate: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true,
        default: '09:00 AM'
    },
    semester: {
        type: String,
        default: '1'
    },
    meetingMode: {
        type: String,
        enum: ['Online', 'Offline'],
        required: true
    },
    agenda: {
        type: String
    },
    discussionTopics: {
        type: String,
        required: false
    },
    issuesIdentified: {
        type: String
    },
    mentorSuggestions: {
        type: String
    },
    actionTaken: {
        type: String
    },
    nextMeetingDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    }
});

module.exports = mongoose.model('MentoringMeeting', mentoringMeetingSchema);
