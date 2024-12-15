import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// axiosInstance.interceptors.request.use(function (config) {
//     const token = sessionStorage.getItem('token');

//     config.headers.Authorization = `Bearer ${token}` || "";

//     return config;
// }, function (error) {

//     return Promise.reject(error);
// });
