const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');
const MentoringReport = require('./models/MentoringReport');

dotenv.config();

const seedReports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const student = await Student.findOne();
        if (!student) {
            console.log('No student found. Run main seed first.');
            process.exit(1);
        }

        await MentoringReport.deleteMany({ studentId: student._id });

        const sampleReports = [
            {
                studentId: student._id,
                mentorName: 'Dr. John Smith',
                meetingDate: new Date('2025-08-15'),
                meetingMode: 'Offline',
                semester: '3',
                year: '2025',
                issuesIdentified: 'Difficulty in managing time for practical labs.',
                discussionSummary: 'Discussed the need for a strict schedule to balance theoretical subjects and practical labs. Advised to join a study group.',
                actionPlan: 'Student will create a weekly timetable and share it with the mentor.',
                status: 'Completed',
                nextMeetingDate: new Date('2025-09-15')
            },
            {
                studentId: student._id,
                mentorName: 'Dr. John Smith',
                meetingDate: new Date('2025-09-18'),
                meetingMode: 'Online',
                semester: '3',
                year: '2025',
                issuesIdentified: 'Low attendance in Data Structures.',
                discussionSummary: 'Student reported health issues causing missed classes. Advised to submit a formal medical certificate and collect notes from peers.',
                actionPlan: 'Submit medical certificate to HOD and catch up on missed topics.',
                status: 'Action Required',
                nextMeetingDate: new Date('2025-10-05')
            },
            {
                studentId: student._id,
                mentorName: 'Dr. John Smith',
                meetingDate: new Date('2025-10-10'),
                meetingMode: 'Offline',
                semester: '3',
                year: '2025',
                issuesIdentified: 'Preparation for upcoming mid-semester exams.',
                discussionSummary: 'Reviewed the study plan submitted by the student. Identified weak areas in Mathematics and suggested reference books.',
                actionPlan: 'Follow the revised study plan. Mentor will check progress in 2 weeks.',
                status: 'Pending Follow-up',
                nextMeetingDate: new Date('2025-10-24')
            }
        ];

        await MentoringReport.insertMany(sampleReports);
        console.log('Mentoring Reports Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedReports();
