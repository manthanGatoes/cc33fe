import axios from 'axios';

const api = axios.create({
  baseURL: 'http://35.154.32.48:8080', // change if needed
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;