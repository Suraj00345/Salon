import api from "./axios.api";

export const createAppointment = async (data) => {
  const response = await api.post("/appointment", data);
  return response.data;
};

export const getMyAppointments = async () => {
  const response = await api.get("/appointment/my");
  return response.data;
};

export const getAppointmentById = async (id) => {
  const response = await api.get(`/appointment/${id}`);
  return response.data;
};

export const rescheduleAppointment = async (id, data) => {
  const response = await api.put(`/appointment/${id}/reschedule`, data);
  return response.data;
};

export const cancelAppointment = async (id) => {
  const response = await api.put(`/appointment/${id}/cancel`);
  return response.data;
};
