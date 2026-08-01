import api from './client';

export const listarSeguimientos = (cultivoId) =>
  api.get(`/cultivos/${cultivoId}/seguimientos`).then((r) => r.data.data.seguimientos);

export const crearSeguimiento = (cultivoId, payload) =>
  api.post(`/cultivos/${cultivoId}/seguimientos`, payload).then((r) => r.data.data.seguimiento);

export const eliminarSeguimiento = (id) =>
  api.delete(`/seguimientos/${id}`).then((r) => r.data.data);

export const subirFotosSeguimiento = (seguimientoId, archivos) => {
  const formData = new FormData();
  archivos.forEach((file) => formData.append('fotos', file));
  return api
    .post(`/seguimientos/${seguimientoId}/fotos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data.data.seguimiento);
};

export const obtenerGaleria = (cultivoId) =>
  api.get(`/cultivos/${cultivoId}/galeria`).then((r) => r.data.data.fotos);
