const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');
const StudentDocument = require('./models/StudentDocument');

dotenv.config();

const seedDocuments = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const student = await Student.findOne();
        if (!student) {
            console.log('No student found. Run main seed first.');
            process.exit(1);
        }

        await StudentDocument.deleteMany({ studentId: student._id });

        const sampleDocs = [
            {
                studentId: student._id,
                documentName: 'Python Web Scraper Assignment',
                category: 'Assignment',
                description: 'Final submission for CSE302. Contains main script and requirements.txt.',
                fileUrl: '/uploads/sample.pdf',
                fileType: 'application/pdf',
                status: 'Approved',
                facultyRemarks: 'Excellent logic and edge-case handling.',
                uploadDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
            },
            {
                studentId: student._id,
                documentName: 'Hackathon Participation',
                category: 'Competition Certificate',
                description: 'Certificate for securing 2nd place in state level hackathon.',
                fileUrl: '/uploads/sample.jpg',
                fileType: 'image/jpeg',
                status: 'Pending Review',
                uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            {
                studentId: student._id,
                documentName: 'OD for Smart India Hackathon',
                category: 'On Duty (OD) Letter',
                description: 'Requested OD from 12th to 15th for travel and participation.',
                fileUrl: '/uploads/sample.pdf',
                fileType: 'application/pdf',
                status: 'Rejected',
                facultyRemarks: 'Dates conflict with mid-semester examinations. Reschedule if possible.',
                uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
            },
            {
                studentId: student._id,
                documentName: 'Summer Internship Offer',
                category: 'Internship Letter',
                description: 'Offer letter from Tech Mahindra for 2 months summer training.',
                fileUrl: '/uploads/sample.pdf',
                fileType: 'application/pdf',
                status: 'Approved',
                facultyRemarks: 'Valid. Submit completion certificate later.',
                uploadDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
        ];

        await StudentDocument.insertMany(sampleDocs);
        console.log('Mock Student Documents Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedDocuments();
