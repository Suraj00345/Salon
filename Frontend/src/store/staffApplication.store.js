import { create } from "zustand";

import {
  createStaffApplication,
  getMyStaffApplication,
} from "../api/staffApplication.api";

const useStaffApplicationStore = create((set) => ({
  application: null,
  loading: false,
  submitting: false,
  error: null,

  fetchMyApplication: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const data = await getMyStaffApplication();

      set({
        application: data.application,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to load application",
      });
    }
  },

  submitApplication: async (applicationData) => {
    try {
      set({
        submitting: true,
        error: null,
      });

      const data = await createStaffApplication(applicationData);

      set({
        application: data.application,
        submitting: false,
      });

      return data;
    } catch (error) {
      set({
        submitting: false,
        error: error.response?.data?.message || "Failed to submit application",
      });

      throw error;
    }
  },

  clearError: () => {
    set({
      error: null,
    });
  },
}));

export default useStaffApplicationStore;
