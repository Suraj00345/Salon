import api from "./axios.api";

export const getStaff = async () => {
  const response = await api.get("/staff/get");
  return response.data;
};

export const getStaffById = async (id) => {
  const response = await api.get(`/staff/get/${id}`);
  return response.data;
};

//admin
export const assignService = async (staffId, date) => {
  const response = await api.get(`/staff/assignService/${staffId}`, {
    params: {
      date,
    },
  });

  return response.data;
};

export const createStaff = async (data) => {
  const response = await api.post("/staff/create", data);
  return response.data;
};

export const updateStaff = async (id, data) => {
  const response = await api.put(`/staff/update/${id}`, data);
  return response.data;
};

export const deleteStaff = async (id) => {
  const response = await api.delete(`/staff/delete/${id}`);
  return response.data;
};
