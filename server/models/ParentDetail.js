const mongoose = require('mongoose');

const ParentDetailSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    fatherName: { type: String, required: true },
    fatherPhone: { type: String, required: true },
    fatherEmail: { type: String },
    motherName: { type: String, required: true },
    motherPhone: { type: String, required: true },
    motherEmail: { type: String },
    homeAddress: { type: String, required: true },
    occupation: { type: String, required: true },
    annualIncome: { type: String, required: true }
});

module.exports = mongoose.model('ParentDetail', ParentDetailSchema);
