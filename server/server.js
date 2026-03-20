require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'https://kvcet-dept-portal.onrender.com'], // Configure this to your frontend URLs in production
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    }
});

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://kvcet-dept-portal.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' })); // Increase payload limit for CSV uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Inject io into the request object so it can be accessed inside controllers
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Health Check Route
app.get('/', (req, res) => {
    res.json({
        status: 'Online',
        message: 'Unified ERP Backend API is running successfully',
        version: '1.0.1'
    });
});

// Unified API Routes
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/circulars', require('./routes/circularRoutes'));
app.use('/api/concerns', require('./routes/concernRoutes'));
app.use('/api/faculty', require('./routes/facultyRoutes'));
app.use('/api/hod', require('./routes/hodRoutes'));
app.use('/api/portal', require('./routes/portalRoutes'));
app.use('/api/data', require('./routes/dataRoutes')); // CSV and Analytics data routes

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('❌ Global Server Error:', err.message);
    res.status(err.status || 500).json({
        error: true,
        message: err.message || 'Internal Server Error'
    });
});

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:Manoj%40007@erp.tando3f.mongodb.net/university_erp?appName=erp';
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Unified MongoDB Connected (Atlas Cluster)'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Socket.io Connection Handler (Real-Time Notification Engine)
const socketHandler = require('./sockets/socketHandler');
socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Unified Backend Server running on port ${PORT}`));