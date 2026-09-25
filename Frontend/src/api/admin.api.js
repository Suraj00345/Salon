import api from "./axios.api";

export const getAdminDashboard = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const updateUserStatus = async (id, status) => {
  const response = await api.put(`/admin/users/${id}/status`, { status });

  return response.data;
};

export const getAllAppointments = async () => {
  const response = await api.get("/admin/appointments");

  return response.data;
};

export const updateAdminAppointmentStatus = async (id, status) => {
  const response = await api.put(`/admin/appointments/${id}/status`, {
    status,
  });

  return response.data;
};
