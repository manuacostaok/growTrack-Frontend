import api from './client';

export const listarCultivos = (params = {}) =>
  api.get('/cultivos', { params }).then((r) => r.data.data);

export const obtenerResumenDashboard = () =>
  api.get('/cultivos/dashboard/resumen').then((r) => r.data.data);

export const obtenerCultivo = (id) => api.get(`/cultivos/${id}`).then((r) => r.data.data.cultivo);

export const crearCultivo = (payload) =>
  api.post('/cultivos', payload).then((r) => r.data.data.cultivo);

export const actualizarCultivo = (id, payload) =>
  api.patch(`/cultivos/${id}`, payload).then((r) => r.data.data.cultivo);

export const cambiarEtapaCultivo = (id, etapa) =>
  api.patch(`/cultivos/${id}/etapa`, { etapa }).then((r) => r.data.data.cultivo);

export const eliminarCultivo = (id) => api.delete(`/cultivos/${id}`).then((r) => r.data.data);
