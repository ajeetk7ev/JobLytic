import { create } from "zustand";
import api from "../utils/api";

const AUTH_BASE = "/auth";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;

  signup: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;

  refreshAccessToken: () => Promise<string>;
  logout: () => Promise<void>;
  setAccessToken: (token: string | null) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  isAuthenticated: false,

  //LOGIN
  login: async (email: string, password: string) => {
    try {
      const res = await api.post(`${AUTH_BASE}/login`, { email, password });

      const accessToken = res.data.accessToken;
      set({ accessToken, isAuthenticated: true });

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || "Login failed",
      };
    }
  },

  //SIGNUP
  signup: async (fullName: string, email: string, password: string) => {
    try {
      const res = await api.post(`${AUTH_BASE}/signup`, {
        fullName,
        email,
        password,
      });

      const accessToken = res.data.accessToken;

      set({ accessToken, isAuthenticated: true });

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || "Signup failed",
      };
    }
  },

  //REFRESH TOKEN
  refreshAccessToken: async () => {
    try {
      const res = await api.post(`${AUTH_BASE}/refresh`, {});
      const token = res.data.accessToken;

      set({ accessToken: token, isAuthenticated: true });

      return token;
    } catch (err) {
      set({ accessToken: null, isAuthenticated: false });
      throw err;
    }
  },

  //LOGOUT
  logout: async () => {
    try {
      await api.post(`${AUTH_BASE}/logout`, {});
    } finally {
      set({ accessToken: null, isAuthenticated: false });
    }
  },

  //Manual setter
  setAccessToken: (token: string | null) =>
    set({
      accessToken: token,
      isAuthenticated: !!token,
    }),

  //Check login state
  checkAuth: async () => {
    const { refreshAccessToken } = get();
    try {
      await refreshAccessToken();
    } catch (err) {
      set({ accessToken: null, isAuthenticated: false });
    }
  },
}));
