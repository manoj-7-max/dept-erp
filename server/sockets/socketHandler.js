module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`🔌 New client connected: ${socket.id}`);

        // Clients emit 'join' with their user ID after successful login
        socket.on('join', (userId) => {
            socket.join(userId);
            console.log(`👤 User ${userId} joined their personal room.`);
        });

        // Allow clients to join role-based rooms (e.g., all HODs get broadcasted requests)
        socket.on('join_role', (role) => {
            socket.join(role);
            console.log(`👥 User joined role room: ${role}`);
        });

        socket.on('disconnect', () => {
            console.log(`🔌 Client disconnected: ${socket.id}`);
        });
    });
};