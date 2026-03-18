const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Triggered by
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['Request_Created', 'Request_Approved', 'Request_Rejected', 'Announcement', 'Alert']
    },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);