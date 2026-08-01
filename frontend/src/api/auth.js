import api from './client';

export const registerRequest = (payload) => api.post('/auth/register', payload).then((r) => r.data.data);
export const loginRequest = (payload) => api.post('/auth/login', payload).then((r) => r.data.data);
export const meRequest = () => api.get('/auth/me').then((r) => r.data.data);
export const logoutRequest = () => api.post('/auth/logout').then((r) => r.data.data);
