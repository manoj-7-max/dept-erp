const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        required: true,
        enum: ['Leave', 'On-Duty', 'Grievance', 'Other']
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    attachmentUrl: { type: String },

    // Workflow State Machine
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Faculty_Approved', 'Faculty_Rejected', 'HOD_Approved', 'HOD_Rejected', 'Closed']
    },

    // Multi-level Handlers
    facultyComments: { type: String },
    hodComments: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);