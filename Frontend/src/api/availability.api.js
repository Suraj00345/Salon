import api from "./axios.api";

export const createWorkingHour = async (data) => {
  const response = await api.post("/availability/create", data);
  return response.data;
};

export const getAvailableSlots = async (staffId, serviceId, date) => {
  const response = await api.get("/availability/slots", {
    params: {
      staffId,
      serviceId,
      date,
    },
  });
  return response.data;
};
