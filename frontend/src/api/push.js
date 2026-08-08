import api from './client';

export const obtenerPublicKey = () => api.get('/push/public-key').then((r) => r.data.data.publicKey);

export const suscribirPush = (subscription) =>
  api.post('/push/suscribir', subscription).then((r) => r.data.data);

export const desuscribirPush = (endpoint) =>
  api.post('/push/desuscribir', { endpoint }).then((r) => r.data.data);
