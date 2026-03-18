const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }
}, { timestamps: true });

// Prevent duplicate conversations between same participants (basic 1v1)
// For 1v1, we can sort participant IDs and store them.
// But for now, let's keep it simple.

module.exports = mongoose.model('Conversation', conversationSchema);
