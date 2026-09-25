import api from "./axios.api";

export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);

  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);

  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/users/getProfile");

  return response.data;
};
