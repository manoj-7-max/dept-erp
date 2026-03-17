require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json());

// Serve uploads directory
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/student/concerns', require('./routes/concernRoutes'));
app.use('/api/student/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/circulars', require('./routes/circularRoutes')); // New circular API endpoints

app.get('/', (req, res) => res.send('Student Mentoring API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
