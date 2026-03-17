const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: {
        type: String,
        enum: ['NOTE', 'ASSIGNMENT', 'LAB_MANUAL', 'QUESTION_PAPER'],
        required: true
    },
    subject: { type: String, required: true }, // Subject Code or Name
    year: { type: Number, required: true },
    semester: { type: Number, required: true },
    url: { type: String, required: true }, // File URL (Cloudinary/S3)
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', resourceSchema);
