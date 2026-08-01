import api from './client';

export const listarArticulos = (params = {}) =>
  api.get('/conocimiento', { params }).then((r) => r.data.data.articulos);

export const obtenerArticulo = (id) =>
  api.get(`/conocimiento/${id}`).then((r) => r.data.data.articulo);
