import api from "./axios.api";

// Submit professional application
export const createStaffApplication = async (data) => {
  const response = await api.post("/staff-applications", data);
  return response.data;
};

// Get logged-in user's application
export const getMyStaffApplication = async () => {
  const response = await api.get("/staff-applications/my");
  return response.data;
};

// Admin: get applications
export const getStaffApplications = async (params = {}) => {
  const response = await api.get("/staff-applications/admin", {
    params,
  });
  return response.data;
};

// Admin: approve
export const approveStaffApplication = async (id) => {
  const response = await api.put(`/staff-applications/admin/${id}/approve`);

  return response.data;
};

// Admin: reject
export const rejectStaffApplication = async (id, adminNote) => {
  const response = await api.put(`/staff-applications/admin/${id}/reject`, {
    adminNote,
  });

  return response.data;
};
