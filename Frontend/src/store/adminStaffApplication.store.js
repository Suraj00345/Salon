import { create } from "zustand";

import {
  getStaffApplications,
  approveStaffApplication,
  rejectStaffApplication,
} from "../api/staffApplication.api";

const useAdminStaffApplicationStore = create((set) => ({
  applications: [],
  loading: false,
  updating: false,
  error: null,

  fetchApplications: async (params = {}) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const data = await getStaffApplications(params);

      set({
        applications: data.applications || [],
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to load applications",
      });
    }
  },

  approve: async (id) => {
    try {
      set({
        updating: true,
        error: null,
      });

      const data = await approveStaffApplication(id);

      set((state) => ({
        applications: state.applications.map((application) =>
          application.id === id
            ? {
                ...application,
                status: "approved",
              }
            : application,
        ),
        updating: false,
      }));

      return data;
    } catch (error) {
      set({
        updating: false,
        error: error.response?.data?.message || "Failed to approve application",
      });

      throw error;
    }
  },

  reject: async (id, adminNote) => {
    try {
      set({
        updating: true,
        error: null,
      });

      const data = await rejectStaffApplication(id, adminNote);

      set((state) => ({
        applications: state.applications.map((application) =>
          application.id === id
            ? {
                ...application,
                status: "rejected",
                adminNote,
              }
            : application,
        ),
        updating: false,
      }));

      return data;
    } catch (error) {
      set({
        updating: false,
        error: error.response?.data?.message || "Failed to reject application",
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

export default useAdminStaffApplicationStore;
