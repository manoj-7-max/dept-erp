const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');
const Mentor = require('./models/Mentor');
const Concern = require('./models/Concern');

dotenv.config();

const seedConcerns = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const student = await Student.findOne();
        if (!student) {
            console.log('No student found. Run main seed first.');
            process.exit(1);
        }

        const faculty = await Mentor.findOne();
        if (!faculty) {
            console.log('No faculty found. Run main seed first.');
            process.exit(1);
        }

        await Concern.deleteMany({ studentId: student._id });

        const sampleConcerns = [
            {
                studentId: student._id,
                title: 'Request for Extra Classes in Data Structures',
                description: 'I have been struggling with advanced algorithms and trees. Is it possible to arrange some remedial classes?',
                concernType: 'Academic',
                priority: 'Medium',
                recipientType: 'Faculty',
                recipientId: faculty._id,
                status: 'Reviewed',
                response: 'We will be organizing a 2-hour remedial session next Friday. Please attend.',
                submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
            },
            {
                studentId: student._id,
                title: 'Library Fine Issue',
                description: 'I was wrongfully charged a late fee for a book I returned on time. Can this be resolved?',
                concernType: 'Personal',
                priority: 'Low',
                recipientType: 'HOD',
                status: 'Resolved',
                response: 'The library database has been updated and the fine has been waived off. Apologies for the inconvenience.',
                submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
            },
            {
                studentId: student._id,
                title: 'Medical Leave Application for Next Week',
                description: 'I need to take 3 days off next week for a minor surgery. I have attached the doctor note.',
                concernType: 'Personal',
                priority: 'High',
                recipientType: 'Faculty',
                recipientId: faculty._id,
                status: 'Pending',
                submittedAt: new Date()
            }
        ];

        await Concern.insertMany(sampleConcerns);
        console.log('Concerns Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedConcerns();
