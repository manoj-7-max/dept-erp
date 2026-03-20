const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const circularSchema = new Schema({
    title: { type: String, required: true },
    category: { type: String, enum: ['Symposium', 'Internship', 'Hackathon', 'Official', 'Academics'], required: true },
    description: { type: String, required: true },
    content: { type: String }, // Detailed rich text content
    audience: { type: String, enum: ['STUDENT', 'FACULTY', 'HOD', 'ALL'], default: 'ALL' },
    isPublic: { type: Boolean, default: false },
    event_date: { type: Date },
    deadline: { type: Date },
    location: { type: String },
    organizer: { type: String },
    attachment_url: { type: String },
    registration_link: { type: String },
    posted_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    posted_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Circular', circularSchema);
