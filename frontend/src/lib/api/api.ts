// src/lib/api/api.ts
// handling axios

import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true
});

// api.interceptors.response.use(
// 	(response) => response,
// 	(error) => {
// 		if (error.response?.status === 401) {
// 			alert('Sesi kamu habis, silakan login ulang!');
// 			window.location.href = '/login';
// 		}
// 		return Promise.reject(error);
// 	}
// );

export default api;
