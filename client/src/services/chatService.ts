import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const chatService = {
    getConversations: () => api.get('/chat/conversations'),
    getMessages: (conversationId: string) => api.get(`/chat/messages/${conversationId}`),
    sendMessage: (data: { recipientId?: string; content: string; conversationId?: string }) => 
        api.post('/chat/messages', data),
    searchUsers: (query: string) => api.get(`/chat/users/search?query=${query}`),
};
