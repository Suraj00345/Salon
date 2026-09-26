import { create } from "zustand";

const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

const useAuthStore = create((set) => ({
  user: getStoredUser(),
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),

  login: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));

    set({
      user,
    });
  },
}));

export default useAuthStore;
