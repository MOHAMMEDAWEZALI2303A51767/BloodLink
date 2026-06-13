import axios from 'axios';

const API = axios.create({
baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
const token = localStorage.getItem('bloodlink_token');
if (token) {
config.headers.Authorization = `Bearer ${token}`;
}
return config;
});

// Handle 401 responses globally
API.interceptors.response.use(
(response) => response,
(error) => {
if (error.response?.status === 401) {
localStorage.removeItem('bloodlink_token');
localStorage.removeItem('bloodlink_user');
window.location.href = '/login';
}
return Promise.reject(error);
}
);

export default API;
