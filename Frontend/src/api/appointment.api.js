import api from "./axios.api";

export const getMyAppointments = async () => {
  const response = await api.get("/appointment/my");
  return response.data;
};

export const createAppointment = async () => {
  const response = await api.post("/appointment");
  return response.data;
};

export const getAppointmentById = async (id) => {
  const response = await api.get(`/appointment/${id}`);
  return response.data;
};

export const rescheduleAppointment = async (id) => {
  const response = await api.put(`/appointment/${id}/reschedule`);
  return response.data;
};

export const cancelAppointment = async (id) => {
  const response = await api.delete(`/appointment/${id}/cancel`);
  return response.data;
};
