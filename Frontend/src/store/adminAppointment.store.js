import { create } from "zustand";

import {
  getAdminAppointments,
  updateAppointmentStatus,
} from "../api/admin.api";

const useAdminAppointmentStore = create((set) => ({
  appointments: [],
  loading: false,
  updating: false,
  error: null,

  fetchAppointments: async (params = {}) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const data = await getAdminAppointments(params);

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

  updateStatus: async (id, status) => {
    try {
      set({
        updating: true,
        error: null,
      });

      const data = await updateAppointmentStatus(id, status);

      set((state) => ({
        appointments: state.appointments.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                status: data.appointment.status,
              }
            : appointment,
        ),
        updating: false,
      }));

      return data;
    } catch (error) {
      set({
        updating: false,
        error:
          error.response?.data?.message ||
          "Failed to update appointment status",
      });

      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAdminAppointmentStore;
