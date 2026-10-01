import api from "./axios.api";

//get all users
export const getAdminUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

//Activate/deactivate user
export const updateUserStatus = async (id, status) => {
  const response = await api.put(`/admin/users/${id}/status`, { status });
  return response.data;
};

//Existing Functions
export const getAdminAppointments = async (params = {}) => {
  const response = await api.get("/admin/appointments", { params });
  return response.data;
};

//update appointment status
export const updateAppointmentStatus = async (id, status) => {
  const response = await api.put(`/admin/appointments/${id}/status`, {
    status,
  });
  return response.data;
};

//get dashboard stats
export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};
