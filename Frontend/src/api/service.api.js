import api from "./axios.api";

export const getServices = async () => {
  const response = await api.get("service/getServices");
  return response.data;
};

export const getServiceById = async () => {
  const response = await api.get(`service/getService/${id}`);
  return response.data;
};

export const createService = async (data) => {
  const response = await api.post("/service/createService", data);
  return response.data;
};

export const updateService = async (id, data) => {
  const response = await api.put(`/service/updateService/${id}`, data);
  return response.data;
};

export const deleteService = async (id) => {
  const response = await api.delete(`/service/deleteService/${id}`);
  return response.data;
};
