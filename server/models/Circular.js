const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const circularSchema = new Schema({
    title: { type: String, required: true },
    category: { type: String, enum: ['Symposium', 'Internship', 'Hackathon'], required: true },
    description: { type: String, required: true },
    event_date: { type: Date, required: true },
    deadline: { type: Date, required: true },
    location: { type: String, required: true },
    organizer: { type: String, required: true },
    attachment_file: { type: String },
    registration_link: { type: String },
    posted_by: { type: String, required: true },
    posted_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Circular', circularSchema);
