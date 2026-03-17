const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: {
        type: String,
        enum: ['OD', 'LEAVE', 'PUBLICATION', 'SYLLABUS', 'MARKS_UPDATE', 'INTERNSHIP'],
        required: true
    },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Faculty
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // HOD
    status: {
        type: String,
        enum: ['PENDING', 'VERIFIED', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    },
    attachmentUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', requestSchema);
