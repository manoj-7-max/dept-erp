import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to include token
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const parsed = JSON.parse(userInfo);
            if (parsed.token) {
                config.headers.Authorization = `Bearer ${parsed.token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const login = async (registerNumber, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
        registerNumber,
        password,
    });
    if (response.data) {
        localStorage.setItem('userInfo', JSON.stringify(response.data));
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('userInfo');
};

export const fetchProfile = () => api.get('/student/profile');
export const updateProfile = (data) => api.put('/student/profile', data);
export const fetchMentor = () => api.get('/student/mentor');
export const fetchAcademicRecords = () => api.get('/student/academic-records');
export const fetchParentDetails = () => api.get('/student/parent-details');
export const fetchActivities = () => api.get('/student/activities');
export const fetchBehaviour = () => api.get('/student/behaviour');
export const fetchMentoringReports = (params) => api.get('/student/mentoring-reports', { params });
export const createMentoringReport = (data) => api.post('/student/mentoring-reports', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// New Mentoring Dashboard APIs
export const scheduleMeeting = (data) => api.post('/student/mentoring-meetings', data);
export const fetchMentorNotes = () => api.get('/student/mentor-notes');
export const addMentorNote = (data) => api.post('/student/mentor-notes', data);
export const fetchMentoringTasks = () => api.get('/student/mentoring-tasks');
export const addMentoringTask = (data) => api.post('/student/mentoring-tasks', data);
export const updateTaskStatus = (id, data) => api.put(`/student/mentoring-tasks/${id}/status`, data);

export const fetchConcerns = () => api.get('/student/concerns');
export const submitConcern = (data) => api.post('/student/concerns', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const fetchFacultyList = () => api.get('/student/concerns/faculty-list');

// Dashboard Expand features
export const fetchDashboardSummary = () => api.get('/student/dashboard/summary');
export const fetchAttendance = () => api.get('/student/dashboard/attendance');
export const fetchMeetings = () => api.get('/student/dashboard/meetings');
export const fetchDocuments = () => api.get('/student/dashboard/documents');
export const uploadDocument = (data) => api.post('/student/dashboard/documents', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteDocument = (id) => api.delete(`/student/dashboard/documents/${id}`);
export const fetchGoals = () => api.get('/student/dashboard/goals');
export const submitGoal = (data) => api.post('/student/dashboard/goals', data);
export const submitFeedback = (data) => api.post('/student/dashboard/feedback', data);
export const fetchTimeline = () => api.get('/student/dashboard/timeline');

export const fetchCirculars = () => api.get('/circulars');
export const postCircular = (data) => api.post('/circulars', data);

export default api;
