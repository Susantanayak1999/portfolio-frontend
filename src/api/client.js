import axios from 'axios';

// This automatically detects if you are on localhost or a network IP
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : `http://${window.location.hostname}:5000/api`;

const client = axios.create({
  baseURL: API_URL
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;