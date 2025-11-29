import axios from 'axios';
const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const instance = axios.create({ baseURL: base });
instance.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if(token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
export default instance;
