const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Mentor = require('./models/Mentor');

dotenv.config();

const seedMentors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing
        await Mentor.deleteMany({});

        const mentors = [
            {
                name: 'Dr. John Smith',
                designation: 'Professor & Head',
                email: 'john.smith@university.edu',
                contactNumber: '+1 234-567-8901',
                department: 'Computer Science'
            },
            {
                name: 'Prof. Sarah Jenkins',
                designation: 'Associate Professor',
                email: 'sarah.jenkins@university.edu',
                contactNumber: '+1 234-567-8902',
                department: 'Computer Science'
            },
            {
                name: 'Dr. Rajesh Kumar',
                designation: 'Assistant Professor',
                email: 'rajesh.kumar@university.edu',
                contactNumber: '+1 234-567-8903',
                department: 'Computer Science'
            },
            {
                name: 'Prof. Michael Brown',
                designation: 'Senior Lecturer',
                email: 'michael.brown@university.edu',
                contactNumber: '+1 234-567-8905',
                department: 'Computer Science'
            },
            {
                name: 'Dr. Anita Desai',
                designation: 'Lecturer',
                email: 'anita.desai@university.edu',
                contactNumber: '+1 234-567-8906',
                department: 'Computer Science'
            },
            {
                name: 'Dr. Emily Chen',
                designation: 'Student Counselor',
                email: 'emily.chen@university.edu',
                contactNumber: '+1 234-567-8904',
                department: 'Student Affairs'
            }
        ];

        const insertedMentors = await Mentor.insertMany(mentors);
        console.log('5 Mentors/Faculty seeded successfully');

        // Fix existing students to point to one of the new mentors
        const Student = require('./models/Student');
        const students = await Student.find({});
        for (let student of students) {
            // Assign a random mentor from the new list
            const randomMentor = insertedMentors[Math.floor(Math.random() * insertedMentors.length)];
            student.mentorId = randomMentor._id;
            await student.save();
        }
        console.log(`Re-linked mentors for ${students.length} students.`);

        process.exit();
    } catch (error) {
        console.error('Error seeding mentors:', error);
        process.exit(1);
    }
};

seedMentors();
