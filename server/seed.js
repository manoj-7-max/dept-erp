require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Student = require('./models/Student');
const Mentor = require('./models/Mentor');
const AcademicRecord = require('./models/AcademicRecord');
const ParentDetail = require('./models/ParentDetail');
const Activity = require('./models/Activity');
const Behaviour = require('./models/Behaviour');
const Concern = require('./models/Concern');
const MentoringReport = require('./models/MentoringReport');
const Attendance = require('./models/Attendance');
const MentoringMeeting = require('./models/MentoringMeeting');
const StudentDocument = require('./models/StudentDocument');
const StudentGoal = require('./models/StudentGoal');
const MentoringFeedback = require('./models/MentoringFeedback');
const TimelineEvent = require('./models/TimelineEvent');
const Circular = require('./models/Circular');
const User = require('./models/User');

const connectDB = require('./config/db');

const importData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Student.deleteMany();
        await Mentor.deleteMany();
        await AcademicRecord.deleteMany();
        await ParentDetail.deleteMany();
        await Activity.deleteMany();
        await Behaviour.deleteMany();
        await Concern.deleteMany();
        await MentoringReport.deleteMany();
        await Attendance.deleteMany();
        await MentoringMeeting.deleteMany();
        await StudentDocument.deleteMany();
        await StudentGoal.deleteMany();
        await MentoringFeedback.deleteMany();
        await TimelineEvent.deleteMany();
        await Circular.deleteMany();
        await User.deleteMany();

        // Create Mentor
        const mentor = await Mentor.create({
            name: 'Dr. Jane Smith',
            designation: 'Associate Professor',
            email: 'jane.smith@univ.edu',
            contactNumber: '+1 9876543210',
            department: 'Computer Science'
        });

        // Hash passwords for Users
        const salt = await bcrypt.genSalt(10);
        const studentPassword = await bcrypt.hash('student123', salt);
        const facultyPassword = await bcrypt.hash('faculty123', salt);
        const hodPassword = await bcrypt.hash('admin123', salt);

        // Create Student
        const student = await Student.create({
            name: 'John Doe',
            registerNumber: 'CS2023001',
            department: 'Computer Science',
            year: 4,
            email: 'john.doe@student.univ.edu',
            phoneNumber: '+1 1234567890',
            homeAddress: '123 Elm Street, Springfield, IN 46201',
            dateOfBirth: new Date('2003-05-15'),
            bloodGroup: 'O+',
            admissionType: 'Counselling',
            category: 'Day Scholar',
            password: studentPassword,
            mentorId: mentor._id
        });

        // --- Seed Users for the new authentication flow ---
        const unifiedFaculty = await User.create({
            _id: mentor._id,
            name: 'Dr. Jane Smith',
            email: 'faculty@college.edu',
            password: facultyPassword,
            role: 'faculty',
            department: 'Computer Science',
            employeeId: 'FAC001'
        });

        await User.create({
            _id: student._id,
            name: 'John Doe',
            email: 'student@college.edu',
            password: studentPassword,
            role: 'student',
            department: 'Computer Science',
            registerNumber: 'CS2023001',
            mentorId: unifiedFaculty._id
        });

        await User.create({
            name: 'Dr. Subramani V',
            email: 'hod@college.edu',
            password: hodPassword,
            role: 'hod',
            department: 'Computer Science',
            employeeId: 'HOD001'
        });
        // --------------------------------------------------------

        // Base Subjects for 8 Semesters
        const semesterSubjects = {
            1: [
                { code: 'CS101', name: 'Programming in C' },
                { code: 'MA101', name: 'Engineering Mathematics I' },
                { code: 'PH101', name: 'Engineering Physics' },
                { code: 'EE101', name: 'Basic Electrical Engineering' },
                { code: 'HS101', name: 'English Communication' }
            ],
            2: [
                { code: 'CS102', name: 'Data Structures' },
                { code: 'MA102', name: 'Engineering Mathematics II' },
                { code: 'CH101', name: 'Engineering Chemistry' },
                { code: 'EC101', name: 'Basic Electronics Engineering' },
                { code: 'ME101', name: 'Engineering Graphics' }
            ],
            3: [
                { code: 'CS201', name: 'Object Oriented Programming' },
                { code: 'CS202', name: 'Digital Logic Design' },
                { code: 'CS203', name: 'Discrete Mathematics' },
                { code: 'MA201', name: 'Engineering Mathematics III' },
                { code: 'HS201', name: 'Environmental Science' }
            ],
            4: [
                { code: 'CS204', name: 'Design and Analysis of Algorithms' },
                { code: 'CS205', name: 'Computer Organization & Architecture' },
                { code: 'CS206', name: 'Database Management Systems' },
                { code: 'CS207', name: 'Operating Systems' },
                { code: 'MA202', name: 'Probability and Statistics' }
            ],
            5: [
                { code: 'CS301', name: 'Theory of Computation' },
                { code: 'CS302', name: 'Computer Networks' },
                { code: 'CS303', name: 'Software Engineering' },
                { code: 'CS304', name: 'Microprocessors and Microcontrollers' },
                { code: 'HS301', name: 'Managerial Economics' }
            ],
            6: [
                { code: 'CS305', name: 'Compiler Design' },
                { code: 'CS306', name: 'Artificial Intelligence' },
                { code: 'CS307', name: 'Information Security' },
                { code: 'CS308', name: 'Web Technologies' },
                { code: 'OE101', name: 'Open Elective I' }
            ],
            7: [
                { code: 'CS401', name: 'Machine Learning' },
                { code: 'CS402', name: 'Cloud Computing' },
                { code: 'PE101', name: 'Professional Elective I' },
                { code: 'PE102', name: 'Professional Elective II' },
                { code: 'OE102', name: 'Open Elective II' }
            ],
            8: [
                { code: 'PE103', name: 'Professional Elective III' },
                { code: 'PE104', name: 'Professional Elective IV' },
                { code: 'PW401', name: 'Project Work' }
            ]
        };

        const assessmentTypes = ['Internal Assessment 1', 'Internal Assessment 2', 'Class Test', 'Assignment 1', 'Assignment 2', 'Semester Marks', 'Seminar Marks', 'Quiz Marks'];
        const academicRecordsData = [];

        // Generate data for all 8 semesters, for all 8 assessment types
        for (let sem = 1; sem <= 8; sem++) {
            const subjectsForSem = semesterSubjects[sem];

            assessmentTypes.forEach(assessment => {
                let maxMarks = 100;
                if (assessment === 'Seminar Marks' || assessment === 'Quiz Marks') {
                    maxMarks = 50;
                }
                if (assessment === 'Class Test') maxMarks = 25;

                const subjectsData = subjectsForSem.map(sub => {
                    // Generate random marks but keep them realistic
                    const minMarks = Math.floor(maxMarks * 0.4); // 40%
                    let generatedMarks = Math.floor(Math.random() * (maxMarks - minMarks + 1)) + minMarks;

                    // Force failure condition for specific request
                    if (sem === 1 && assessment === 'Semester Marks' &&
                        (sub.code === 'CS101' || sub.code === 'MA101')) {
                        generatedMarks = Math.floor(Math.random() * (maxMarks * 0.35)); // Force < 40%
                    }

                    // Calculate grade
                    let grade = 'RA';
                    const percentage = (generatedMarks / maxMarks) * 100;
                    if (percentage >= 90) grade = 'O';
                    else if (percentage >= 80) grade = 'A+';
                    else if (percentage >= 70) grade = 'A';
                    else if (percentage >= 60) grade = 'B+';
                    else if (percentage >= 50) grade = 'B';
                    else if (percentage >= 40) grade = 'C';

                    return {
                        subjectCode: sub.code,
                        subjectName: sub.name,
                        marksScored: generatedMarks,
                        maximumMarks: maxMarks,
                        grade: grade
                    };
                });

                academicRecordsData.push({
                    studentId: student._id,
                    semester: sem,
                    assessmentType: assessment,
                    subjects: subjectsData
                });
            });
        }

        await AcademicRecord.insertMany(academicRecordsData);

        // Create Parent Details
        await ParentDetail.create({
            studentId: student._id,
            fatherName: 'Robert Doe',
            fatherPhone: '+1 1112223333',
            fatherEmail: 'robert.doe@example.com',
            motherName: 'Jane Doe',
            motherPhone: '+1 9998887777',
            motherEmail: 'jane.doe@example.com',
            homeAddress: '123 Elm Street, Springfield, IN 46201',
            occupation: 'Software Engineer',
            annualIncome: '$85,000'
        });

        // Create Activities
        await Activity.insertMany([
            { studentId: student._id, eventName: 'Hackathon 2024', achievement: '1st Runner Up', certificateUrl: 'link-to-cert-1' },
            { studentId: student._id, eventName: 'Tech Symposium', achievement: 'Participant', certificateUrl: 'link-to-cert-2' }
        ]);

        // Create Behaviour
        await Behaviour.create({
            studentId: student._id,
            attendanceRemarks: 'Good attendance record overall. Needs slight improvement in morning classes.',
            disciplineRemarks: 'Excellent behavior, no disciplinary issues.',
            facultyComments: 'Active participant in lab sessions, interacts well with peers.'
        });

        // Create Concerns
        await Concern.create({
            studentId: student._id,
            title: 'Difficulty with Advanced Algorithms',
            description: 'Struggling with the Advanced Algorithms coursework and need extra references.',
            concernType: 'Academic',
            priority: 'Medium',
            recipientType: 'Faculty',
            recipientId: mentor._id,
            status: 'Reviewed',
            response: 'I have shared some textbook PDFs and online course links. Let us review your progress next week.'
        });

        // Create Mentoring Reports
        await MentoringReport.insertMany([
            {
                studentId: student._id,
                mentorName: mentor.name,
                meetingDate: new Date('2023-11-15'),
                meetingMode: 'Offline',
                semester: '3',
                year: '2',
                issuesIdentified: 'Backlog in Mathematics',
                discussionSummary: 'Discussed semester 3 results and clearing the single backlog. Strategy formulated.',
                actionPlan: 'Student will attend remedial classes for the backlog subject.',
                status: 'Completed',
                nextMeetingDate: new Date('2023-12-15')
            },
            {
                studentId: student._id,
                mentorName: mentor.name,
                meetingDate: new Date('2023-12-15'),
                meetingMode: 'Online',
                semester: '3',
                year: '2',
                issuesIdentified: 'None',
                discussionSummary: 'Reviewed progress of remedial classes. Student feeling confident for upcoming supplementary exam.',
                actionPlan: 'Final revision before exams.',
                status: 'Pending Follow-up',
                nextMeetingDate: new Date('2024-01-20')
            }
        ]);

        // Create Attendance Data
        const attendanceData = semesterSubjects[3].map((sub, index) => {
            // Simulate low attendance for one subject
            const isLow = index === 2;
            const total = 40;
            const attended = isLow ? 25 : Math.floor(Math.random() * 10) + 30; // 25/40 = 62.5% vs 75-100%

            return {
                studentId: student._id,
                subjectCode: sub.code,
                subjectName: sub.name,
                totalClasses: total,
                classesAttended: attended
            };
        });
        await Attendance.insertMany(attendanceData);

        // Create Mentoring Meetings
        const meeting1 = await MentoringMeeting.create({
            studentId: student._id,
            mentorId: mentor._id,
            meetingType: 'Mentor Meeting',
            meetingDate: new Date('2024-02-10T10:00:00'),
            meetingMode: 'Offline',
            discussionTopics: 'Academic progress, Attendance issue in Discrete Mathematics',
            issuesIdentified: 'Low attendance due to health issues last month.',
            mentorSuggestions: 'Submit medical certificate to department head. Make up for missed classes.',
            actionTaken: 'Student agreed to submit documentation.',
            nextMeetingDate: new Date('2024-03-10T10:00:00')
        });

        await MentoringMeeting.create({
            studentId: student._id,
            mentorId: mentor._id,
            meetingType: 'Mentor Meeting',
            meetingDate: new Date('2024-03-12T14:30:00'),
            meetingMode: 'Online',
            discussionTopics: 'Review of previous action items, upcoming internship opportunities',
            issuesIdentified: 'None',
            mentorSuggestions: 'Apply for summer internship at local tech companies.',
            actionTaken: 'Reviewed resume.',
            nextMeetingDate: new Date('2024-04-15T10:00:00')
        });

        await MentoringMeeting.create({
            studentId: student._id,
            mentorId: mentor._id,
            meetingType: 'Class Committee Meeting',
            meetingDate: new Date('2024-03-20T11:00:00'),
            meetingMode: 'Offline',
            discussionTopics: 'Semester feedback, faculty performance review, syllabus coverage discussion',
            issuesIdentified: 'Students requested more practical sessions for Data Structures lab.',
            mentorSuggestions: 'Will coordinate with the lab faculty to add additional hands-on sessions.',
            actionTaken: 'Feedback recorded and forwarded to Head of Department.',
            nextMeetingDate: new Date('2024-04-20T11:00:00')
        });

        // Create Student Documents
        await StudentDocument.insertMany([
            { studentId: student._id, documentName: 'Hackathon Participation Certificate.pdf', category: 'Achievement Certificate', fileType: 'application/pdf', fileUrl: '#' },
            { studentId: student._id, documentName: 'Medical Leave Request Form.pdf', category: 'Medical Certificate', fileType: 'application/pdf', fileUrl: '#' }
        ]);

        // Create Student Goals
        await StudentGoal.create({
            studentId: student._id,
            careerInterest: 'Software Development / AI',
            skillsToDevelop: ['React', 'Node.js', 'Python Machine Learning'],
            targetCompaniesOrUniversities: ['Google', 'Microsoft', 'Local Startups'],
            mentorSuggestions: 'Focus on building full-stack projects to strengthen your portfolio before placements.',
            progressStatus: 'In Progress'
        });

        // Create Mentoring Feedback
        await MentoringFeedback.create({
            studentId: student._id,
            meetingId: meeting1._id,
            rating: 5,
            feedbackComments: 'The meeting was very helpful. Clarified the process for submitting medical leave.',
            suggestions: 'None'
        });

        // Create Timeline Events
        await TimelineEvent.insertMany([
            { studentId: student._id, title: 'Semester Started', description: 'Beginning of the academic semester.', eventType: 'Academic', date: new Date('2023-08-01') },
            { studentId: student._id, title: 'Internal Assessment 1', description: 'First round of internal exams conducted.', eventType: 'Academic', date: new Date('2023-09-15') },
            { studentId: student._id, title: 'Hackathon 2024', description: 'Participated in university level hackathon and secured 1st Runner Up.', eventType: 'Competition', date: new Date('2023-10-10') },
            { studentId: student._id, title: 'First Mentor Meeting', description: 'Initial review of academic progress.', eventType: 'Mentor Meeting', date: new Date('2023-11-15') },
            { studentId: student._id, title: 'Internal Assessment 2', description: 'Second round of internal exams conducted.', eventType: 'Academic', date: new Date('2023-11-20') },
            { studentId: student._id, title: 'Assignment 1 Submitted', description: 'Data Structures assignment uploaded.', eventType: 'Academic', date: new Date('2023-11-25') },
            { studentId: student._id, title: 'Class Test Conducted', description: 'Unit 3 class test completed for Discrete Mathematics.', eventType: 'Academic', date: new Date('2023-12-05') },
            { studentId: student._id, title: 'Semester Exam Completed', description: 'Odd semester final examinations concluded.', eventType: 'Academic', date: new Date('2023-12-20') },
            { studentId: student._id, title: 'Symposium Participation', description: 'Attended the national level tech symposium.', eventType: 'Competition', date: new Date('2024-01-15') },
            { studentId: student._id, title: 'Medical Leave Submitted', description: 'Submitted documents for 5 days of sick leave.', eventType: 'Document', date: new Date('2024-01-25') },
            { studentId: student._id, title: 'Mentor Meeting 2 Conducted', description: 'Discussed attendance issues with mentor.', eventType: 'Mentor Meeting', date: new Date('2024-02-10') },
            { studentId: student._id, title: 'Attendance Warning Generated', description: 'Computer Networks attendance dropped below 75%.', eventType: 'Health / Personal', date: new Date('2024-02-15') },
            { studentId: student._id, title: 'Permission Letter Uploaded', description: 'Uploaded permission letter for OD.', eventType: 'Document', date: new Date('2024-02-28') }
        ]);

        // Sample Circulars
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);

        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        await Circular.insertMany([
            {
                title: 'AI & Machine Learning Symposium',
                category: 'Symposium',
                description: 'Join industry experts to explore cutting-edge advancements in Artificial Intelligence and Machine Learning models. Open to all third and fourth-year students.',
                event_date: nextMonth,
                deadline: nextWeek,
                location: 'Main Auditorium',
                organizer: 'CSE Department',
                attachment_file: 'http://localhost:5000/uploads/symposium.png',
                registration_link: 'https://example.com/register/symposium',
                posted_by: 'Dr. Jane Smith',
                posted_date: new Date()
            },
            {
                title: 'Google Summer Software Intern',
                category: 'Internship',
                description: 'Apply for the upcoming summer internship program at Google. Bring your resumes and be prepared for an initial screening round.',
                event_date: nextWeek,
                deadline: tomorrow,
                location: 'Placement Cell',
                organizer: 'Placement Office',
                attachment_file: 'http://localhost:5000/uploads/internship.png',
                registration_link: 'https://careers.google.com/internships',
                posted_by: 'Prof. Kumar R.',
                posted_date: new Date()
            },
            {
                title: 'CodeRed Hackathon 2026',
                category: 'Hackathon',
                description: 'A 48-hour continuous hackathon focused on building scalable web solutions for climate change. Great prizes to be won!',
                event_date: nextMonth,
                deadline: nextMonth,
                location: 'Innovation Lab',
                organizer: 'Coding Club',
                attachment_file: 'http://localhost:5000/uploads/hackathon.png',
                registration_link: 'https://example.com/codered',
                posted_by: 'Dr. Meena S.',
                posted_date: new Date()
            }
        ]);

        console.log('Dummy Data Imported Successfully!');
        console.log('Login credentials:');
        console.log('Register Number: CS2023001');
        console.log('Password: password123');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
