import { create } from "zustand";

const useBookingStore = create((set) => ({
  service: null,
  staff: null,
  date: null,
  slot: null,

  setService: (service) => set({ service }),

  setStaff: (staff) =>
    set({
      staff,
      slot: null,
    }),

  setDate: (date) =>
    set({
      date,
      slot: null,
    }),

  setSlot: (slot) => set({ slot }),

  clearBooking: () =>
    set({
      service: null,
      staff: null,
      date: null,
      slot: null,
    }),
}));

export default useBookingStore;
