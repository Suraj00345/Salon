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
        appointments: data.appointments,
        loading: false,
      });
    } catch (error) {
      set({ error: error.response?.data?.message, loading: false });
    }
  },

  bookAppointment: async (bookingData) => {
    const data = await createAppointment(bookingData);
    return data;
  },

  cancelAppointment: async (id) => {
    await cancelAppointment(id);
    set((state) => ({
      appointments: state.appointments.filter(
        (appointment) => appointment.id !== id,
      ),
    }));
  },
}));


export default useAppointmentStore;