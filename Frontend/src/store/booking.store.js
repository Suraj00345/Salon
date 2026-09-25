import { create } from "zustand";

const useBookingStore = create((set) => ({
  service: null,
  staff: null,
  date: null,
  time: null,

  setService: (service) => {
    set({
      service,
    });
  },
  setStaff: (staff) => {
    set({
      staff,
    });
  },
  setDate: (date) => {
    set({
      date,
    });
  },
  setTime: (time) => {
    set({
      time,
    });
  },

  clearBooking: () => {
    set({
      service: null,
      staff: null,
      date: null,
      time: null,
    });
  },
}));

export default useBookingStore;
