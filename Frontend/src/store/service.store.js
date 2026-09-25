import { create } from "zustand";
import { getServiceById, getServices } from "../api/service.api";

const useServiceStore = create((set) => ({
  services: [],
  selectedService: null,
  loading: false,
  error: null,

  fetchServices: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const data = await getServices();

      set({
        services: data.services || [],
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load services",
        loading: false,
      });
    }
  },

  fetchServiceById: async (id) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const data = await getServiceById(id);

      set({
        selectedService: data.service,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to load service",
        loading: false,
      });
    }
  },
}));

export default useServiceStore;
