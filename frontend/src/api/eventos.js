import api from './client';

export const listarEventos = (params = {}) => api.get('/eventos', { params }).then((r) => r.data.data.eventos);

export const crearEvento = (payload) => api.post('/eventos', payload).then((r) => r.data.data.evento);

export const actualizarEvento = (id, payload) =>
  api.patch(`/eventos/${id}`, payload).then((r) => r.data.data.evento);

export const eliminarEvento = (id) => api.delete(`/eventos/${id}`).then((r) => r.data.data);
