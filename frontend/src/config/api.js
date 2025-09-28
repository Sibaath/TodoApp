// src/config/api.js

import axios from 'axios';

// The base URL for your Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api';

// Create an Axios instance for easy request handling
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Allows sending cookies or authorization headers if we were using real sessions
    withCredentials: true,
});

export default api;