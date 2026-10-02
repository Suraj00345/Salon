import { create } from "zustand";
import { getStaff, getStaffById } from "../api/staff.api";

const useStaffStore = create((set) => ({
  staff: [],
  selectedStaff: null,

  loading: false,
  error: null,

  fetchStaff: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const data = await getStaff();

      // console.log("GET STAFF RESPONSE:", data);

      set({
        staff: Array.isArray(data?.staff) ? data.staff : [],
        loading: false,
      });
    } catch (error) {
      console.error("Fetch staff error:", error.response?.data || error);

      set({
        loading: false,
        error: error.response?.data?.message || "Failed to load staff",
      });
    }
  },

  fetchStaffById: async (id) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const data = await getStaffById(id);

      set({
        selectedStaff: data?.staff || null,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to load staff member",
      });
    }
  },

  clearSelectedStaff: () =>
    set({
      selectedStaff: null,
    }),
}));

export default useStaffStore;
