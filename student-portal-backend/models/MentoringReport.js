const mongoose = require('mongoose');

const MentoringReportSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    mentorName: { type: String, required: true },
    meetingDate: { type: Date, required: true },
    meetingMode: { type: String, enum: ['Online', 'Offline'], required: true },
    semester: { type: String, required: true },
    year: { type: String },
    issuesIdentified: { type: String },
    discussionSummary: { type: String, required: true },
    actionPlan: { type: String, required: true }, // Replaces followUpAction
    status: { type: String, enum: ['Completed', 'Pending Follow-up', 'Action Required'], default: 'Completed' },
    attachmentFile: { type: String },
    nextMeetingDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('MentoringReport', MentoringReportSchema);
