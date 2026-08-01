import api from './client';

export const listarUsuariosAdmin = (params = {}) =>
  api.get('/admin/usuarios', { params }).then((r) => r.data.data);

export const cambiarPlanUsuarioAdmin = (id, plan) =>
  api.patch(`/admin/usuarios/${id}/plan`, { plan }).then((r) => r.data.data.usuario);

export const obtenerMetricasAdmin = () => api.get('/admin/metricas').then((r) => r.data.data);
