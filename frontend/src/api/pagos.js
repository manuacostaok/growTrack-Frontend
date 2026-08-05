import api from './client';

export const crearSuscripcion = (plan) =>
  api.post('/pagos/crear-suscripcion', { plan }).then((r) => r.data.data);

export const cancelarSuscripcion = () =>
  api.post('/pagos/cancelar-suscripcion').then((r) => r.data.data);

export const obtenerMiSuscripcion = () =>
  api.get('/pagos/mi-suscripcion').then((r) => r.data.data.subscription);
