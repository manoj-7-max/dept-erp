const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://127.0.0.1:27017/university_erp').then(async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('student123', salt);
    
    // Explicitly update every single student imported from CSV without a password
    const res = await mongoose.connection.collection('students').updateMany(
        { $or: [{ password: { $exists: false } }, { password: null }] },
        { $set: { password: hashedPassword, role: 'student' } }
    );
    
    console.log(`✅ Successfully mapped default encrypted passwords ('student123') to ${res.modifiedCount} total students!`);
    process.exit(0);
});
