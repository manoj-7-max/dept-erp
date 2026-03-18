const mongoose = require('mongoose');

const timelineEventSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    eventType: {
        type: String, // e.g., 'Internal Assessment', 'Mentor Meeting', 'Competition', 'Seminar', 'Internship'
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('TimelineEvent', timelineEventSchema);
