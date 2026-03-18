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
        origin: '*', // Configure this to your frontend URLs in production
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Inject io into the request object so it can be accessed inside controllers
app.use((req, res, next) => {
    req.io = io;
    next();
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

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/university_erp')
    .then(() => console.log('✅ Unified MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Socket.io Connection Handler (Real-Time Notification Engine)
const socketHandler = require('./sockets/socketHandler');
socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Unified Backend Server running on port ${PORT}`));