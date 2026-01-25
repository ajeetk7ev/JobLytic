import { create } from "zustand";
import api from "@/utils/api";

interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isCheckingAuth: boolean;

  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string; errors?: any }>;

  signup: (
    fullName: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string; errors?: any }>;

  setUser: (user: User) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isAuthLoading: false,
  isCheckingAuth: true,

  setUser: (user) => set({ user }),

  // LOGIN
  login: async (email: string, password: string) => {
    set({ isAuthLoading: true });
    try {
      const res = await api.post(`/auth/login`, {
        email,
        password,
      });
      set({ user: res.data.user, isAuthenticated: true });
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
        errors: err.response?.data?.errors,
      };
    } finally {
      set({ isAuthLoading: false });
    }
  },

  // SIGNUP
  signup: async (fullName: string, email: string, password: string) => {
    set({ isAuthLoading: true });
    try {
      const res = await api.post(`/auth/signup`, {
        fullName,
        email,
        password,
      });
      set({ user: res.data.user, isAuthenticated: true });
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Signup failed",
        errors: err.response?.data?.errors,
      };
    } finally {
      set({ isAuthLoading: false });
    }
  },

  // LOGOUT
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  // CHECK AUTH
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await api.get("/auth/get-me");
      set({ user: res.data.user, isAuthenticated: true });
    } catch (err) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
