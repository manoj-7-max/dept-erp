const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    eventName: { type: String, required: true },
    achievement: { type: String, required: true },
    certificateUrl: { type: String }
});

module.exports = mongoose.model('Activity', ActivitySchema);
