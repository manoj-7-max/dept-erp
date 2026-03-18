const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        enum: ['LAB_ISSUE', 'ELECTRICAL', 'FURNITURE', 'PROJECTOR', 'CLEANLINESS', 'OTHER'],
        required: true
    },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
    status: {
        type: String,
        enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'],
        default: 'PENDING'
    },
    location: { type: String, required: true }, // e.g., "Computer Lab 1", "Room 304"
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: String }, // e.g., "Technician A"
    resolvedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', complaintSchema);
