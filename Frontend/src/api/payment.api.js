import api from "./axios.api";

export const createPaymentOrder = async (appointmentId) => {
  const response = await api.post("/payment/create-order", {
    appointmentId,
  });

  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await api.post("/payment/verify", paymentData);

  return response.data;
};
