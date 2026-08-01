import api from './client';

export const diagnosticarFoto = (archivo) => {
  const formData = new FormData();
  formData.append('foto', archivo);
  return api
    .post('/ia/diagnostico', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data.data.diagnostico);
};
