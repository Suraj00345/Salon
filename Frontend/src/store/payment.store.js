import { create } from "zustand";

import { createPaymentOrder, verifyPayment } from "../api/payment.api";

const usePaymentStore = create((set) => ({
  loading: false,
  error: null,

  createOrder: async (appointmentId) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const data = await createPaymentOrder(appointmentId);

      set({
        loading: false,
      });

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create payment order";

      set({
        loading: false,
        error: message,
      });

      throw error;
    }
  },

  verify: async (paymentData) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const data = await verifyPayment(paymentData);

      set({
        loading: false,
      });

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Payment verification failed";

      set({
        loading: false,
        error: message,
      });

      throw error;
    }
  },

  clearError: () =>
    set({
      error: null,
    }),
}));

export default usePaymentStore;
