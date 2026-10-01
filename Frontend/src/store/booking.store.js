// src/store/booking.store.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useBookingStore = create(
  persist(
    (set) => ({
      service: null,
      staff: null,
      date: null,
      slot: null,
      time: null,

      initiateBooking: (service) =>
        set({
          service,
          staff: null,
          date: null,
          slot: null,
          time: null,
        }),

      setService: (service) =>
        set({
          service,
          staff: null,
          date: null,
          slot: null,
          time: null,
        }),

      setStaff: (staff) =>
        set({
          staff,
          slot: null,
          time: null,
        }),

      setDate: (date) =>
        set({
          date,
          slot: null,
          time: null,
        }),

      setSlot: (slot) =>
        set({
          slot,
          time: typeof slot === "string" ? slot : slot?.startTime || null,
        }),

      setTime: (time) => set({ time, slot: time }),

      clearBooking: () =>
        set({
          service: null,
          staff: null,
          date: null,
          slot: null,
          time: null,
        }),
    }),
    {
      name: "booking-storage", // key name in storage
      storage: createJSONStorage(() => sessionStorage), // sessionStorage keeps it alive across refreshes, but resets when tab is closed
    },
  ),
);

export default useBookingStore;
