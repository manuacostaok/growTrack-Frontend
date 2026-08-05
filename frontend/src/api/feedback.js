import api from './client';

export const enviarFeedback = (mensaje, pagina) =>
  api.post('/feedback', { mensaje, pagina }).then((r) => r.data.data);

export const listarFeedbackAdmin = () =>
  api.get('/admin/feedback').then((r) => r.data.data.feedback);
