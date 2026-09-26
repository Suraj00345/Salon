import { create } from "zustand";

import {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
} from "../api/appointment.api";

const useAppointmentStore = create((set) => ({
  appointments: [],
  loading: false,
  error: null,

  fetchAppointments: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const data = await getMyAppointments();

      set({
        appointments: data.appointments || [],
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to load appointments",
      });
    }
  },

  bookAppointment: async (bookingData) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const data = await createAppointment(bookingData);

      set({
        loading: false,
      });

      return data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to create appointment",
      });

      throw error;
    }
  },

  cancel: async (id) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const data = await cancelAppointment(id);

      set((state) => ({
        appointments: state.appointments.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                status: "cancelled",
              }
            : appointment,
        ),
        loading: false,
      }));

      return data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to cancel appointment",
      });

      throw error;
    }
  },
}));

export default useAppointmentStore;
