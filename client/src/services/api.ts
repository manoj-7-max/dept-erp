import axios from 'axios';
import { BACKEND_URL } from '@/config/apiConfig';

const api = axios.create({
    baseURL: `${BACKEND_URL}/api`,
});

// Auto-attach token from localStorage
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Global response handler
api.interceptors.response.use(
    (response) => response,
    (error) => {
        let message = 'An error occurred';
        if (error.response) {
            message = error.response.data?.error || error.response.data?.message || message;
        }
        return Promise.reject(new Error(message));
    }
);

// Faculty APIs
export const fetchMentees = () => api.get('/faculty/mentees');
export const scheduleMeeting = (data: any) => api.post('/faculty/mentoring/schedule', data); // We'll implement this controller too

// Dashboard stats
export const fetchFacultyStats = () => api.get('/faculty/stats');

export default api;
