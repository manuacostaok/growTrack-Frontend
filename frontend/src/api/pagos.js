import api from './client';

export const crearPreferencia = (plan) =>
  api.post('/pagos/crear-preferencia', { plan }).then((r) => r.data.data);

export const obtenerMiSuscripcion = () =>
  api.get('/pagos/mi-suscripcion').then((r) => r.data.data.subscription);
