import api from './axios';

// Auth
export const login = async (data: any) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const register = async (data: any) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

// Patients
export const getPatients = async () => {
  const response = await api.get('/patients');
  return response.data;
};

export const createPatient = async (data: any) => {
  const response = await api.post('/patients', data);
  return response.data;
};

export const updatePatient = async (id: number, data: any) => {
  const response = await api.patch(`/patients/${id}`, data);
  return response.data;
};

export const deletePatient = async (id: number) => {
  const response = await api.delete(`/patients/${id}`);
  return response.data;
};

// Specialists
export const getSpecialists = async () => {
  const response = await api.get('/specialists');
  return response.data;
};

export const createSpecialist = async (data: any) => {
  const response = await api.post('/specialists', data);
  return response.data;
};

export const updateSpecialist = async (id: number, data: any) => {
  const response = await api.patch(`/specialists/${id}`, data);
  return response.data;
};

export const deleteSpecialist = async (id: number) => {
  const response = await api.delete(`/specialists/${id}`);
  return response.data;
};

// Appointments
export const getAppointments = async () => {
  const response = await api.get('/appointments');
  return response.data;
};

export const createAppointment = async (data: any) => {
  const response = await api.post('/appointments', data);
  return response.data;
};

export const updateAppointment = async (id: number, data: any) => {
  const response = await api.patch(`/appointments/${id}`, data);
  return response.data;
};

export const deleteAppointment = async (id: number) => {
  const response = await api.delete(`/appointments/${id}`);
  return response.data;
};
