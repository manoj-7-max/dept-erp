const mongoose = require('mongoose');

const ConcernSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    concernType: { type: String, enum: ['Personal', 'Academic'], required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    recipientType: { type: String, enum: ['Faculty', 'HOD'], required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' }, // Required if Faculty
    status: { type: String, enum: ['Pending', 'Reviewed', 'Resolved'], default: 'Pending' },
    response: { type: String },
    attachmentFile: { type: String },
    voiceFile: { type: String }
}, { timestamps: { createdAt: 'submittedAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('Concern', ConcernSchema);
