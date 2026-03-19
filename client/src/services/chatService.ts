import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

const api = axios.create({
    baseURL: API_BASE_URL,
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
