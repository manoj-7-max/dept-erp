const mongoose = require('mongoose');

const studentDocumentSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    documentName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: [
            'Assignment',
            'On Duty (OD) Letter',
            'Permission Letter',
            'Achievement Certificate',
            'Internship Letter',
            'Medical Certificate',
            'Competition Certificate',
            'Project Document',
            'Other'
        ],
        required: true
    },
    description: {
        type: String,
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    fileUrl: {
        type: String,
        required: true // URL/path to the uploaded document
    },
    fileType: {
        type: String, // e.g., 'application/pdf', 'image/jpeg'
    },
    status: {
        type: String,
        enum: ['Pending Review', 'Approved', 'Rejected'],
        default: 'Pending Review'
    },
    facultyRemarks: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('StudentDocument', studentDocumentSchema);
