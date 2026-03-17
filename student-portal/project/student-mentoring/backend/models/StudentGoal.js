const mongoose = require('mongoose');

const studentGoalSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    careerInterest: {
        type: String, // e.g., 'Software Engineer', 'Higher Studies'
        required: true
    },
    skillsToDevelop: {
        type: [String],
        required: true
    },
    targetCompaniesOrUniversities: {
        type: [String]
    },
    mentorSuggestions: {
        type: String
    },
    progressStatus: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started'
    }
}, { timestamps: true });

module.exports = mongoose.model('StudentGoal', studentGoalSchema);
