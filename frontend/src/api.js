import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://truelove-backend.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authApi = {
    login: (name, gender) => api.post('/login', { name, gender }),
};

export const submissionApi = {
    getAll: (type = 'all') => api.get(`/submissions?type=${type}`),
    create: (formData) => {
        return api.post('/submissions', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    update: (id, formData, adminPass = '') => {
        const headers = {
            'Content-Type': 'multipart/form-data',
        };
        if (adminPass) {
            headers['x-admin-pass'] = adminPass;
        }
        return api.put(`/submissions/${id}`, formData, { headers });
    },
    delete: (id, userId, adminPass = '') => {
        const headers = {
            'x-user-id': userId,
        };
        if (adminPass) {
            headers['x-admin-pass'] = adminPass;
        }
        return api.delete(`/submissions/${id}`, { headers });
    },
};

export const userApi = {
    getRankings: () => api.get('/rankings'),
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    updateGender: (id, gender) => {
        const formData = new FormData();
        formData.append('gender', gender);
        return api.patch(`/users/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};

export default api;
