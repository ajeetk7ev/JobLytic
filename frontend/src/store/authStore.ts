import { create } from "zustand";
import { API_URL } from "@/utils/api";
import axios from "axios";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  setToLocalStorage,
} from "@/utils/localstorage";

interface AuthState {
  token: string | null;
  isAuthenticationLoading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;

  signup: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;

  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: getFromLocalStorage("token") ? getFromLocalStorage("token") : null,
  isAuthenticationLoading: false,

  //LOGIN
  login: async (email: string, password: string) => {
    set({ isAuthenticationLoading: true });
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { token } = res.data.token;
      setToLocalStorage("token", token);
      set({ token: token });
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || "Login failed",
      };
    } finally {
      set({ isAuthenticationLoading: false });
    }
  },

  //SIGNUP
  signup: async (fullName: string, email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/auth/signup`, {
        fullName,
        email,
        password,
      });

      const token = res.data.token;
      setToLocalStorage("token", token);
      set({ token: token });

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || "Signup failed",
      };
    } finally {
      set({ isAuthenticationLoading: false });
    }
  },

  //LOGOUT
  logout: async () => {
    removeFromLocalStorage("token");
    set({ token: null });
  },
}));
