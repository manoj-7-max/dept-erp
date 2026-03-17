const mongoose = require('mongoose');

const circularSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    audience: {
        type: String,
        enum: ['ALL', 'STUDENT', 'FACULTY', 'HOD'],
        default: 'ALL'
    },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPublic: { type: Boolean, default: false }, // If true, visible on public website
    attachmentUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Circular', circularSchema);
