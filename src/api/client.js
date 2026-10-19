import axios from 'axios';

// Hardcode the production URL. If we are on localhost, use localhost.
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isLocal 
  ? 'http://localhost:5000/api' 
  : 'https://susanta-portfolio-api.onrender.com/api';

const client = axios.create({
  baseURL: API_URL
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;