import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    // Upload endpoint expects multipart/form-data
    return await api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const fetchHistory = async () => {
    return await api.get('/analysis');
};

export const fetchBatchRecords = async (batchId) => {
    return await api.get(`/batch/${batchId}/records`);
};
