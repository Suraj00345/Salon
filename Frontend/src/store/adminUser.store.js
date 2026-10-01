import { create } from "zustand";
import { getAdminUsers, updateUserStatus } from "../api/admin.api";

const useAdminUserStore = create((set) => ({
  users: [],
  loading: false,
  updating: false,
  error: null,

  // Fetch all users
  fetchUsers: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const data = await getAdminUsers();

      set({
        users: data.users || [],
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to load users",
      });
    }
  },

  // Activate / deactivate user
  updateStatus: async (id, isActive) => {
    try {
      set({
        updating: true,
        error: null,
      });

      const data = await updateUserStatus(id, isActive);

      set((state) => ({
        users: state.users.map((user) =>
          user.id === id
            ? {
                ...user,
                isActive: data.user.isActive,
              }
            : user,
        ),
        updating: false,
      }));

      return data;
    } catch (error) {
      set({
        updating: false,
        error: error.response?.data?.message || "Failed to update user status",
      });

      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useAdminUserStore;
