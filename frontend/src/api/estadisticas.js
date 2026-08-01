import api from './client';

export const obtenerEstadisticas = (cultivoId) =>
  api.get(`/estadisticas/${cultivoId}`).then((r) => r.data.data);

export const compararCultivos = (idA, idB) =>
  api.get('/estadisticas/comparar', { params: { a: idA, b: idB } }).then((r) => r.data.data);
