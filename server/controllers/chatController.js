const Message = require('../models/Message');
const User = require('../models/User');

// 1. Get Chat History
exports.getMessages = async (req, res) => {
    try {
        const { userId } = req.params; // Target user's ID
        const currentUserId = req.user._id || req.user.id;

        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, receiverId: userId },
                { senderId: userId, receiverId: currentUserId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Send Message
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = req.user._id || req.user.id;

        const newMessage = await Message.create({ senderId, receiverId, content });

        // Attach sender profile and emit instantly via SocketProvider's 'new_message' listener
        const populatedMessage = await Message.findById(newMessage._id).populate('senderId', 'name role');
        req.io.to(receiverId.toString()).emit('new_message', populatedMessage);

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Search Users for Directory
exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const currentUserId = req.user._id || req.user.id;
        const currentUserRole = req.user.role;

        if (!query || query.length < 2) {
            return res.json([]);
        }

        const searchCriteria = {
            _id: { $ne: currentUserId },
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { registerNumber: { $regex: query, $options: 'i' } },
                { employeeId: { $regex: query, $options: 'i' } }
            ]
        };

        // Students search for faculty/HOD, Faculty search for students/faculty/HOD
        // (Removing strict filtering for now to allow discovery, but can be refined)
        const users = await User.find(searchCriteria)
            .limit(10)
            .select('name role department registerNumber employeeId');

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};