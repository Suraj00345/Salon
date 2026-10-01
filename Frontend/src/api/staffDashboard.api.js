import api from "./axios.api";

export const getStaffDashboardStats = async () => {
  const response = await api.get(`/staff/dashboard`);
  return response.data;
};

export const getStaffAppointments = async (params = {}) => {
  const response = await api.get(`/staff/appointments`, { params });
  return response.data;
};

export const updateStaffAppointmentStatus = async (appointmentId, status) => {
  const response = await api.put(
    `/staff/appointments/${appointmentId}/status`,
    { status }
  );
  return response.data;
};