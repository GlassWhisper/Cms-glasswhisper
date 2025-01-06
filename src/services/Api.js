import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Ambil token dari localStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        if (response.status === 200 || response.status === 201) {
            return response;
        } else {
            const messages = response.data?.messages;
            return Promise.reject({ messages: messages || ["got errors"] });
        }
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("authToken"); 
            localStorage.removeItem("role");
            window.location.href = '/login'; // Redirect ke halaman login tanpa refresh manual
        } else if (error.response && error.response.status === 500) {
            return Promise.reject(error.response);
        } else {
            return Promise.reject(error);
        }
    }
);

export default axiosInstance;
